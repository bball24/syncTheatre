### Install MongoDB ( On Ubuntu )

- Official Guide: https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv D68FA50FEA312927

echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

sudo apt-get update

sudo apt-get install -y mongodb-org
```

Start MongoDB

```
# Start Server
sudo service mongod start

# Check Log
sudo cat /var/log/mongodb/mongod.log

# Stop Server
sudo service mongod stop

# Restart Server
sudo service mongod stop
```

*Note*: Change ownership of the sock file to get the service started correctly if needed.
- https://medium.com/@gabrielpires/mongodb-ubuntu-16-04-code-exited-status-14-aws-lightsail-problem-417ffc78cb11

*Note*: Make sure /data/db is owned by mongod:mongod
`sudo chown mongod:mongod /db/data`

*Note*: If you run into trouble try the following
`sudo rm /tmp/monogo...` <use tab autocomplete>

### Managing MongoDB

- `sudo service start mongod` starts the mongodb service
- `mongo --shell` connects you to the shell
- You can check the status of the service with `sudo service mongod status`