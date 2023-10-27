#/bin/sh
set -e
docker --version
docker build -t ojd-2856b298-311f-402e-b904-6d93068140f0 .
docker create --name ojd-cont-2856b298-311f-402e-b904-6d93068140f0 ojd-2856b298-311f-402e-b904-6d93068140f0
docker cp ojd-cont-2856b298-311f-402e-b904-6d93068140f0:/open-joystick-display/dist .
docker rm -f ojd-cont-2856b298-311f-402e-b904-6d93068140f0
docker image rm -f ojd-2856b298-311f-402e-b904-6d93068140f0
