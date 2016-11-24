#!/bin/bash

# When you change this file, you must take manual action. Read this doc:
# - https://docs.sandstorm.io/en/latest/vagrant-spk/customizing/#setupsh

set -euo pipefail
# This is the ideal place to do things like:
#
export DEBIAN_FRONTEND=noninteractive
# Add latest nodejs sources
curl -sL https://deb.nodesource.com/setup_6.x | bash -
# Install required packages
apt-get install -y nodejs git-core g++

exit 0
