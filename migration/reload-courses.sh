curl -s -X GET "https://buscaramos.osuc.dev/api/courses" \
  -H "Authorization: Bearer $API_SECRET" \
  -H "Accept: application/x-ndjson; charset=utf-8" \
| npx wrangler r2 object put ousc-public/courses-score.ndjson --remote --pipe \
    --content-type "application/x-ndjson; charset=utf-8"
