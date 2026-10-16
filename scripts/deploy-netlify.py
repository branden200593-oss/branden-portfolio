#!/usr/bin/env python3
"""Deploy only this project's review alias. No production/access/settings mutation.
API file protocol and branch-alias behavior follow Netlify OpenAPI + CLI.
Credentials are read only from the environment and never logged or persisted.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

SITE_ID = '4e04a51a-fad2-4280-8edf-91ac2e4e3b28'
SITE_NAME = 'branden-portfolio-v1'
BRANCH = 'codex-preview'
API = 'https://api.netlify.com/api/v1'


def api(method, route, data=None, content_type='application/json'):
    token = os.environ.get('NETLIFY_AUTH_TOKEN')
    if not token:
        raise RuntimeError('Missing Netlify authorization: supply NETLIFY_AUTH_TOKEN securely in environment settings; never paste it in chat.')
    body = json.dumps(data).encode() if isinstance(data, dict) else data
    req = Request(API + route, data=body, method=method,
                  headers={'Authorization': 'Bearer ' + token, 'Content-Type': content_type})
    try:
        with urlopen(req, timeout=45) as response:
            raw = response.read()
            return json.loads(raw) if raw else {}
    except HTTPError as exc:
        raise RuntimeError(f'Netlify API HTTP {exc.code}; no site settings or access permissions were changed.') from None
    except URLError:
        raise RuntimeError('Cannot reach api.netlify.com through this environment network. Allow the required domain in environment settings.') from None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Only verify access to the existing site')
    args = parser.parse_args()
    site = api('GET', f'/sites/{SITE_ID}')
    if site.get('id') != SITE_ID or site.get('name') != SITE_NAME:
        raise RuntimeError('Existing site identity differs. Refusing to deploy or create a replacement site.')
    print('Existing Netlify site verified: ' + SITE_NAME, flush=True)
    if args.check:
        return
    root = Path(__file__).resolve().parents[1] / 'dist'
    if not (root / 'index.html').is_file() or not (root / '_headers').is_file() or not (root / '_redirects').is_file():
        raise RuntimeError('Build output or security/routing files are missing. Run npm run build first.')
    manifest, by_digest = {}, {}
    for file in sorted(root.rglob('*')):
        if not file.is_file():
            continue
        if file.is_symlink():
            raise RuntimeError('Refusing a symlink in the deployment output.')
        path = file.relative_to(root).as_posix()
        if path.startswith('.') or file.suffix in {'.map', '.env'}:
            raise RuntimeError('Unexpected private/build-debug file in deployment output.')
        digest = hashlib.sha1(file.read_bytes()).hexdigest()
        manifest['/' + path] = digest
        by_digest[digest] = (path, file)
    # Netlify CLI uses draft:false plus a nonproduction branch for a stable alias.
    # Never omit the branch and never invoke the production restore/publish API.
    deploy = api('POST', f'/sites/{SITE_ID}/deploys?title=BRANDEN%20review',
                 {'files': manifest, 'draft': False, 'branch': BRANCH})
    deploy_id = deploy['id']
    for digest in deploy.get('required', []):
        if digest not in by_digest:
            raise RuntimeError('Netlify requested an unknown artifact digest.')
        path, file = by_digest[digest]
        api('PUT', f'/deploys/{deploy_id}/files/{quote(path, safe="/")}', file.read_bytes(), 'application/octet-stream')
    for attempt in range(90):
        deploy = api('GET', f'/sites/{SITE_ID}/deploys/{deploy_id}')
        if deploy.get('state') == 'ready':
            break
        if deploy.get('state') in {'error', 'rejected', 'cancelled'}:
            raise RuntimeError('Netlify rejected the review deployment; inspect its build log.')
        if attempt % 5 == 0:
            print('Waiting for Netlify: ' + str(deploy.get('state')), flush=True)
        time.sleep(2)
    else:
        raise RuntimeError('Netlify readiness timeout. Do not report deployment success.')
    if deploy.get('branch') != BRANCH:
        raise RuntimeError('Deployment branch differs from the requested review alias.')
    result = {'site_id': SITE_ID, 'deploy_id': deploy_id, 'branch': BRANCH,
              'state': deploy['state'], 'unique_url': deploy.get('deploy_ssl_url'),
              'review_url': f'https://{BRANCH}--{SITE_NAME}.netlify.app',
              'public_access_changed': False, 'production_replaced': False}
    out = root.parent / '.artifacts'
    out.mkdir(exist_ok=True)
    (out / 'netlify-deploy.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
    print('Deployment is ready; verify the review URL and inherited access protection before claiming browser readiness.')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, KeyError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
