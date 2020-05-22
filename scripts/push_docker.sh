#!/bin/bash

set -ex

VERSION_NUMBER="$1"

rm -rf ../public/build/
cd ../ && npm run build
docker build --no-cache -t jaskaransarkaria/timer-client:"$VERSION_NUMBER" .
docker push jaskaransarkaria/timer-client:"$VERSION_NUMBER"

exit 0
