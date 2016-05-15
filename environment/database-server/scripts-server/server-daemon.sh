#!/usr/bin/env bash

echo "========================"
echo "setting up server daemon"
echo "========================"

sudo cp /home/vagrant/config/node-server.conf /etc/init/
sudo stop node-server
sudo start node-server
