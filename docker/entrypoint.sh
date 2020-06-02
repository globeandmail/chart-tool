#!/bin/bash
set -e

echo "Running in ${NODE_ENV} environment."

# Commands you may want to pass:
# gulp meteorServe
# gulp libServe

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
