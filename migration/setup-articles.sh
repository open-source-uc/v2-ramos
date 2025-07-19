#!/bin/bash

# Script para crear las tablas de contenido (organizaciones, blogs, recomendaciones)
# Solo se ejecuta en ambiente local

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en ambiente local
check_local_environment() {
    if [[ "${NODE_ENV}" == "production" ]]; then
        log_error "Este script solo puede ejecutarse en ambiente local"
        log_error "NODE_ENV está configurado como: ${NODE_ENV}"
        exit 1
    fi
    
    if [[ "${CLOUDFLARE_ENV}" == "production" ]]; then
        log_error "Este script solo puede ejecutarse en ambiente local"
        log_error "CLOUDFLARE_ENV está configurado como: ${CLOUDFLARE_ENV}"
        exit 1
    fi
    
    log_info "Verificación de ambiente: OK (local)"
}

# Función para ejecutar SQL
execute_sql() {
    local sql_file="./sql/content/articles.sql"
    
    if [[ ! -f "$sql_file" ]]; then
        log_error "Archivo SQL no encontrado: $sql_file"
        return 1
    fi
    
    log_info "Ejecutando: $sql_file"
    
    # Usar wrangler d1 para ejecutar localmente
    if command -v npx &> /dev/null; then
        npx wrangler d1 execute v2-ramos --local --file="$sql_file" -y
    else
        log_error "No se encontró npx"
        return 1
    fi
}

# Función principal
main() {
    log_info "Iniciando creación de tablas de contenido..."
    
    # Verificar ambiente
    check_local_environment
    
    # Verificar que existe el archivo SQL
    if [[ ! -f "./sql/content/articles.sql" ]]; then
        log_error "Archivo SQL no encontrado: ./sql/content/articles.sql"
        exit 1
    fi
    
    log_info "Archivo SQL encontrado"
    
    # Confirmar ejecución
    echo
    log_warn "¿Estás seguro de que quieres crear las tablas de contenido?"
    log_warn "Esto incluye: organizations, blogs, recommendations"
    read -p "Presiona Enter para continuar o Ctrl+C para cancelar..."
    echo
    
    # Ejecutar SQL
    log_info "Creando tablas de contenido..."
    execute_sql
    
    log_info "✅ Tablas de contenido creadas exitosamente"
    log_info "Tablas creadas:"
    log_info "  - organizations (organizaciones estudiantiles)"
    log_info "  - blogs (artículos de blog)"
    log_info "  - recommendations (recomendaciones de cursos)"
    log_info "  - Índices optimizados para consultas"
    
    echo
    log_info "🎉 Proceso completado exitosamente"
}

# Ejecutar solo si el script se llama directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
