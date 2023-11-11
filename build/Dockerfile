FROM node:12-bullseye

RUN apt update
# Install gcc
RUN apt install -y python3 python2
RUN apt install -y build-essential make git

RUN git clone https://github.com/North-West-Wind/open-joystick-display-transparent.git
WORKDIR /open-joystick-display

RUN npm install -g prebuild-install

RUN yarn install

RUN npm install -g gulp

RUN yarn build
