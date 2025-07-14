#!/bin/bash

npx wrangler r2 object put ousc-public/courses-sections.ndjson -f migration/ndjson/2025-2.ndjson  --content-type "application/x-ndjson; charset=utf-8"  --remote   
