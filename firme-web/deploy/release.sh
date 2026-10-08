#!/usr/bin/env bash
# Rulează pe hz2.65: actualizează aplicația din branch-ul curent al clonei din /opt/firme-web/repo.
# Conținutul din /opt/firme-web/dist se înlocuiește pe loc (nu directorul), ca bind mount-ul nginx să rămână valid.
set -euo pipefail
cd /opt/firme-web/repo && git pull --ff-only
cd firme-web && npm ci --no-audit --no-fund && npm test && npm run build
find /opt/firme-web/dist -mindepth 1 -delete
cp -r dist/. /opt/firme-web/dist/
cp deploy/nginx.conf /opt/firme-web/nginx.conf
docker exec firme-web nginx -t && docker exec firme-web nginx -s reload
curl -fsS -o /dev/null https://firme.cerniq.app/ && echo "OK: firme.cerniq.app actualizat"
