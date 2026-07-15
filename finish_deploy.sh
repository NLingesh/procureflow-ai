#!/bin/bash
# This script must be run with sudo: sudo ./finish_deploy.sh

set -e

if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script with sudo."
  exit 1
fi

echo "=== Starting Root-Level Apache Deployment ==="

# 1. Enable required modules
echo "Enabling Apache modules (rewrite, proxy, proxy_http)..."
a2enmod rewrite proxy proxy_http

# 2. Copy the VirtualHost configuration
echo "Copying Apache virtual host configuration..."
cp /home/wiz/Desktop/procureflow-ai/apache-procureflow.conf /etc/apache2/sites-available/000-default.conf

# 3. Copy frontend build files to /var/www/html
echo "Deploying React build files to /var/www/html..."
if [ -f /var/www/html/index.html ] && [ ! -f /var/www/html/index.html.bak ]; then
  echo "Backing up default index.html to index.html.bak..."
  mv /var/www/html/index.html /var/www/html/index.html.bak
fi

# Clean old static assets if any
rm -rf /var/www/html/assets

# Copy build
cp -r /home/wiz/Desktop/procureflow-ai/frontend/dist/* /var/www/html/

# Ensure correct permissions
chown -R www-data:www-data /var/www/html

# 4. Restart Apache
echo "Restarting Apache web server..."
systemctl restart apache2

echo ""
echo "=== Apache deployment complete! ==="
echo "The application should now be accessible at http://localhost/"
echo "=========================================="
