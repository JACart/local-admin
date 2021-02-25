#!/bin/bash
echo 'Path:' $1
echo 'Port:' $2

if ! screen -list | grep "ui-server"; then
    screen -dmS ui-server
    else
    ./scripts/ui-server-stop.sh
    screen -dmS ui-server
fi

screen -S ui-server -p 0 -X stuff "./npm-start.sh $1"
screen -S ui-server -p 0 -X stuff '\n'
echo "Started!"