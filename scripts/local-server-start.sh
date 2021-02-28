#!/bin/bash
echo 'Path:' $1
echo 'Port:' $2

if ! screen -list | grep "local-server"; then
    screen -dmS local-server
    else
    ./scripts/local-server-stop.sh
    screen -dmS local-server
fi

screen -S local-server -p 0 -X stuff "unset npm_config_prefix\n"
screen -S local-server -p 0 -X stuff "source ~/.bashrc\n"
screen -S local-server -p 0 -X stuff "./scripts/npm-start.sh $1 $2"
screen -S local-server -p 0 -X stuff '\n'
echo "Started!"
