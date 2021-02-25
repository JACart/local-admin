#!/bin/bash
echo 'Path:' $1
echo 'Port:' $2

if ! screen -list | grep "pose-server"; then
    screen -dmS pose-server
    else
    ./scripts/pose-server-stop.sh
    screen -dmS pose-server
fi

screen -S pose-server -p 0 -X stuff "./npm-start.sh $1"
screen -S pose-server -p 0 -X stuff '\n'
echo "Started!"