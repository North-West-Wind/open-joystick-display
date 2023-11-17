# Open Joystick Display
**A powerful and easy to use streamer-ready overlay for your joystick or gamepad. Completely free and open source.**

## This fork (North-West-Wind)
This fork isn't based on the original repository. Instead, it forks from [skrrp/open-joystick-display](https://github.com/skrrp/open-joystick-display) for they provided a handy script for building the program.

This fork makes the Electron window transparent, so it looks way better on OBS Studio.

## This branch (North-West-Wind)
You are currently looking at the `network-only` branch. As the name suggests, this branch only includes the `network` driver.
However, it got rid of Electron, making it much more light weight. The program runs on an Express server now.

### Usage (North-West-Wind)
1. Install Node.js (at least v16).
2. Clone this repository (branch) to somewhere.
3. `cd` into the directory, then run the following command to build:
```bash
npm i && npm run build
```
4. Run this command to start the server:
```bash
npm start
```
5. Launch OBS. Add a Browser Source. Set the URL to `file://{absolute_path_to_this_repo}/app/views/index.view.html`
    - You can optionally add `#broadcast` at the end of the URL to start it in broadcast mode
6. Configure your stuff there. Profit!

### Configuration (North-West-Wind)
Most of the original configurations of Open Joystick Display are only available in the OBS Browser Source, as the data is being saved inside OBS' local storage, the one exception being `#broadcast` mode. (Refer to 5. of [Usage](#usage-north-west-wind))

There are 2 things you can configure for the Express server, using a `.env` file.
- PORT
    - Default: 3000
    - The port of the Express server. It will fail if you have other stuff running on that port.
- ADDRESS
    - Default: localhost
    - The address of the Express server. Setting to `localhost` will only allow the computer running the server to access it. If you are running the server remotely, set this to `0.0.0.0`.

### Project on life support (skrrp)
The main author has discontinued the project and I am not an Electron developer. The links that KernelZechs had to the binaries to run this project are long-dead and the download site is now being domain-squatted by a scummy online pharmacy. As such, it is impossible to download pre-built binaries any more.

I have forked the repo and added the `/build` directory. It contains a `Dockerfile` and a build script. You DO NOT need to check out the whole repo to make a build, but you may do so if you wish.

I will note that building this application in 2023 throws up some fairly scary warnings. Since I am not an Electron developer I can't say how dangerous this all is. If anyone wishes to keep the code up to date I will accept PRs on this fork. I have used this fork in the build process as I note the parent is archived.

## Build instructions in 2023 (skrrp)
Note by NorthWestWind: You don't need to do this. These instructions are for the main branch.
* Install `docker`
* Download the 2 files in the `/build` directory or navigate to it if you have done a full checkout
* Ensure that `build.sh` is executable
* Run it: `./build.sh`
* Docker will do its thing and when it has finished there will be a new `dist` directory in `/build` directory. This contains the build artefacts

If you are not a developer and are only using `docker` for this one thing, you may need to clear up some base images to reclaim disk space.

    $ docker image ls
    REPOSITORY                      TAG                   IMAGE ID       CREATED          SIZE
    node                            12-bullseye           bafd2af2faeb   18 months ago    917MB
    
    $ docker image rm -f bafd2af2faeb

Replace the image ID in the last command with the one you get from your `docker image ls` command.

## Documentation

### License
https://github.com/KernelZechs/open-joystick-display/blob/master/LICENSE.md

### Changelog
https://github.com/KernelZechs/open-joystick-display/blob/master/docs/changelog.md

### Development and Deployment Guide
https://github.com/KernelZechs/open-joystick-display/blob/master/docs/build.md

### Getting Started
https://github.com/KernelZechs/open-joystick-display/blob/master/docs/getting-started.md

### Theme Development
https://github.com/KernelZechs/open-joystick-display/blob/master/docs/theme-development.md
