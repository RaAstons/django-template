#!/bin/bash
# We need to use bash because of the use of the /dev/tcp device

INITIAL=$HOME/INITIAL

if [ -f $INITIAL ]; then
    if [ ! -e "requirements/dev.txt" ]; then
        pip install pip-tools
        pip-compile requirements/dev.in
    fi

    pip install -r requirements/dev.txt

    # Wait for the db server to be ready, then run the fixturize command
    while ! (echo > /dev/tcp/db/5432) >/dev/null 2>&1; do echo -n '.'; sleep 1; done;
    echo "Running fixturize..."
    ./manage.py fixturize -y
    rm $INITIAL
fi

exec "${@}"
