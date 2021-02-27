#!/bin/bash

gnome-terminal --tab -e " sh -c 'cd $1; ./run.sh; exec bash;'"