curl -s -X GET "https://buscaramos.osuc.dev/api/courses" \
  -H "Authorization: Bearer k46XX6wxA1va74BAV8" \
  -H "Accept: application/json" 
| npx wrangler r2 object put ousc-public/courses-score.json --remote --pipe