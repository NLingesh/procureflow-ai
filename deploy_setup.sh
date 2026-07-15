#!/bin/bash
set -e

echo "=== Starting ProcureFlow AI Deployment ==="

# 1. Build React Frontend
echo "Building React frontend..."
cd /home/wiz/Desktop/procureflow-ai/frontend
npm run build
cd /home/wiz/Desktop/procureflow-ai

# 2. Set up Backend Systemd User Service
echo "Setting up systemd user service for backend..."
mkdir -p ~/.config/systemd/user
cp procureflow-backend.service ~/.config/systemd/user/procureflow-backend.service

# 3. Reload systemd user configuration and restart service
echo "Reloading systemd user daemon..."
systemctl --user daemon-reload

echo "Enabling and starting procureflow-backend service..."
systemctl --user enable procureflow-backend.service
systemctl --user restart procureflow-backend.service

echo ""
echo "=== Backend service deployed successfully! ==="
echo "Status check:"
systemctl --user status procureflow-backend.service --no-pager || true

echo ""
echo "=== Apache (Frontend) Configuration Instructions ==="
echo "Since Apache runs as root, please execute the following commands to finish the deployment:"
echo ""
echo "1. Enable required Apache modules (mod_rewrite, mod_proxy, mod_proxy_http):"
echo "   sudo a2enmod rewrite proxy proxy_http"
echo ""
echo "2. Copy the virtual host configuration template to Apache:"
echo "   sudo cp /home/wiz/Desktop/procureflow-ai/apache-procureflow.conf /etc/apache2/sites-available/000-default.conf"
echo ""
echo "3. Copy the built React frontend files to Apache web root:"
echo "   # (Optional) Back up existing index.html"
echo "   sudo mv /var/www/html/index.html /var/www/html/index.html.bak 2>/dev/null || true"
echo "   # Copy new build"
echo "   sudo cp -r /home/wiz/Desktop/procureflow-ai/frontend/dist/* /var/www/html/"
echo ""
echo "4. Restart Apache to apply configuration changes:"
echo "   sudo systemctl restart apache2"
echo ""
echo "====================================================="
