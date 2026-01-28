#!/bin/sh
set -e

OUTPUT_DIR="${OUTPUT_DIR:-/data}"
SCHEDULE="${SCHEDULE:-0 3 * * 0}"

# Run initial update
echo "Running initial relay data update..."
python scripts/update_relais.py -o "${OUTPUT_DIR}/relais.json"

# If running in one-shot mode, exit
if [ "${ONE_SHOT}" = "true" ]; then
    echo "One-shot mode, exiting."
    exit 0
fi

# Setup cron job
echo "Setting up scheduled updates: ${SCHEDULE}"

# Create cron entry
echo "${SCHEDULE} cd /app && python scripts/update_relais.py -o ${OUTPUT_DIR}/relais.json >> /var/log/updater.log 2>&1" > /etc/crontabs/root

# Start cron in foreground
echo "Starting cron daemon..."
exec crond -f -l 2
