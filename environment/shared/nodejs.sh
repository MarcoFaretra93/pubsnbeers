#!/usr/bin/env bash

#install nodejs
echo "================="
echo "installing nodejs"
echo "================="
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
