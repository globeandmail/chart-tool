#!/bin/bash
set -e

echo "Running in ${NODE_ENV} environment."

exec "$@"
