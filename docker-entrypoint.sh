#!/bin/sh
set -e

# Generate runtime config.json from environment variables
# Use defaults if environment variables are not set
CONFIG_FILE="/usr/share/nginx/html/config.json"

# Default values
DEFAULT_PARENT_SITE_NAME="OERadio"
DEFAULT_PARENT_SITE_URL="https://oeradio.at"
DEFAULT_PARENT_SITE_LOGO="https://oeradio.at/wp-content/uploads/2026/01/oeradiologo-300x200.png"

# Use env vars if set, otherwise use defaults
SITE_NAME="${PARENT_SITE_NAME:-$DEFAULT_PARENT_SITE_NAME}"
SITE_URL="${PARENT_SITE_URL:-$DEFAULT_PARENT_SITE_URL}"
SITE_LOGO="${PARENT_SITE_LOGO:-$DEFAULT_PARENT_SITE_LOGO}"

cat > "$CONFIG_FILE" << EOF
{
  "parentSiteName": "$SITE_NAME",
  "parentSiteUrl": "$SITE_URL",
  "parentSiteLogo": "$SITE_LOGO"
}
EOF

echo "Generated config.json:"
cat "$CONFIG_FILE"
echo ""

# Start nginx in foreground
exec nginx -g "daemon off;"
