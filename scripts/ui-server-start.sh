#!/bin/bash
echo 'Path:' $1
echo 'Port:' $2

if ! screen -list | grep "ui-server"; then
    screen -dmS ui-server
    else
    ./scripts/ui-server-stop.sh
    screen -dmS ui-server
fi

screen -S local-server -p 0 -X stuff "unset npm_config_prefix\n"
screen -S local-server -p 0 -X stuff "source ~/.bashrc\n"
screen -S ui-server -p 0 -X stuff "./scripts/npm-start.sh $1"
screen -S ui-server -p 0 -X stuff '\n'
echo "Started!"
