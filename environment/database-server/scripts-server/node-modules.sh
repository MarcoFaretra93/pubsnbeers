#!/usr/bin/env bash

echo "======================="
echo "installing node modules"
echo "======================="

sudo npm install -g nodemon mocha
npm --prefix /home/vagrant/project/app/ install /home/vagrant/project/app/
