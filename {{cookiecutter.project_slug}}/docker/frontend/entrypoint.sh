#!/bin/sh

INITIAL=$HOME/INITIAL

if [ -f $INITIAL ]; then
    npm install
    rm $INITIAL
fi

exec "${@}"
