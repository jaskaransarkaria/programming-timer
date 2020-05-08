#!/bin/bash

set -ex

VERSION_NUMBER="$1"

rm -rf ../public/build/
docker build --no-cache -t jaskaransarkaria/timer-client:"$VERSION_NUMBER" ../
docker push jaskaransarkaria/timer-client:"$VERSION_NUMBER"
