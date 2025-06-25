#!/bin/bash

# Preguntar si el usuario quiere modo local o remoto
echo "Seleccione el modo de ejecución:"
echo "1) Local"
echo "2) Remoto"
read -p "Opción (1/2): " mode

# Definir el flag según la opción elegida
if [ "$mode" == "1" ]; then
    FLAG="--local"
elif [ "$mode" == "2" ]; then
    FLAG="--remote"
else
    echo "Opción inválida. Saliendo."
    exit 1
fi

# npx wrangler r2 object put v2-ramos/2025-1.json -f ./json/2025-1.json $FLAG
# npx wrangler r2 object put v2-ramos/valores_unicos.json -f ./json/valores_unicos.json $FLAG

npx wrangler d1 execute v2-ramos $FLAG --file=./sql/main.sql -y
echo "main ready"

echo "Insertando cursos"
for file in ./sql/courses/*.sql; do
    echo "Ejecutando $file..."
    npx wrangler d1 execute v2-ramos $FLAG --file="$file" -y
done