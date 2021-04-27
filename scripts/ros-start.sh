#!/bin/bash

gnome-terminal --tab -e " sh -c '$1/run.sh $2; exec bash;'"
