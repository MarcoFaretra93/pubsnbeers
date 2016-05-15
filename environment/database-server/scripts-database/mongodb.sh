#!/usr/bin/env bash

echo "=================="
echo "Installing MongoDB"
echo "=================="

# Get key and add to sources
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

# Make MongoDB connectable from outside world without SSH tunnel
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

echo "=================="
echo "setting up MongoDB"
echo "=================="
# Make MongoDB connectable from outside world without SSH tunnel
    # enable remote access
    # setting the mongodb bind_ip to allow connections from everywhere    
sudo sed -i "s/bindIp.*/bindIp: 10.11.1.7/" /etc/mongod.conf



# Setting up locale for mongoDB
sudo locale-gen
sudo echo "LC_ALL=en_US.UTF-8" >> /etc/environment
result=`sudo service mongod status`
if [[ $result == *"mongod start/running"* ]]; then
	echo "===================="
	echo "setting up completed"
	echo "===================="
else
	echo "================================"
	echo "setting up unsuccessful, see log"
	echo "================================"
	echo $result
fi

