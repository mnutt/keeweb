#!/bin/bash
set -euo pipefail

cd /opt/app

# ensure data storage directory exists
sudo mkdir -p /var/keeweb
sudo chown $USER /var/keeweb
mkdir -p /var/keeweb/data
