#!/usr/bin/env bash

echo "========================"
echo "setting up mongo-express"
echo "========================"

npm --prefix resources/mongo-express-master/ install resources/mongo-express-master/
sudo cp /home/vagrant/config/mongo-express.conf /etc/init/
sudo service mongod restart
sudo stop mongo-express
sudo start mongo-express

