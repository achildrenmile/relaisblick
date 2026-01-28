#!/bin/sh
set -e

# Generate runtime config.json from environment variables
CONFIG_FILE="/usr/share/nginx/html/config.json"

cat > "$CONFIG_FILE" << EOF
{
  "parentSiteName": "${PARENT_SITE_NAME:-}",
  "parentSiteUrl": "${PARENT_SITE_URL:-}",
  "parentSiteLogo": "${PARENT_SITE_LOGO:-}"
}
EOF

echo "Generated config.json:"
cat "$CONFIG_FILE"
echo ""

# Start nginx in foreground
exec nginx -g "daemon off;"
