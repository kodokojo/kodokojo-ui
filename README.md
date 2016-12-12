
# Kodo Kojo UI

This is the UI for Kodo Kojo project 

[![Join the chat at https://gitter.im/kodokojo/kodokojo](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000)](https://gitter.im/kodokojo/kodokojo) 

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/) 
[![](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat)](http://www.gnu.org/licenses/gpl-3.0.en.html)     

[![](https://img.shields.io/badge/version-1.1.0-orange.svg?style=flat&maxAge=2592000)](https://github.com/kodokojo/kodokojo-ui#kodo-kojo-ui)
[![node](https://img.shields.io/badge/node-5.x.x-yellow.svg?style=flat&maxAge=2592000)](https://github.com/kodokojo/kodokojo-ui#kodo-kojo-ui) 
[![npm](https://img.shields.io/badge/npm-3.x.x-blue.svg?style=flat&maxAge=2592000)](https://github.com/kodokojo/kodokojo-ui#kodo-kojo-ui)  

[![Dependency Status](https://dependencyci.com/github/kodokojo/kodokojo-ui/badge)](https://dependencyci.com/github/kodokojo/kodokojo-ui)


## License

`kodokojo-ui` is a licensed under [GNU General Public License v3](http://www.gnu.org/licenses/gpl-3.0.en.html).

## Contribute

You want to contribute? You are very welcome!  
Chat with us on Gitter.  
Please read following [commit message policy](https://github.com/kodokojo/kodokojo-ui/blob/dev/COMMIT.md) and [contributing policy](https://github.com/kodokojo/kodokojo-ui/blob/dev/CONTRIBUTING.md).

## Prerequisite

- NodeJS (see package.json file for version).
- Consider using nvm to switch node version in development easily.
- Docker 1.8 or newer.
- jq.
- A working build of [kodokojo](https://github.com/kodokojo/kodokojo) project.

## Browser support

The UI is tested on Firefox and Chrome  

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- |
| last version| last version| last version
<sub><sub>thanks to @godban for the badge generator</sup></sub>

## Configuration

#### Development

You have to set some environment variables.  
For Mac users with Docker Toolbox, setup DOCKER_HOST environment variable:

    $ eval $(docker-machine env default) // mount docker env variables

For Windows users, you may do something like (not sure of the command, please PR if it is not correct):

    > docker-machine env

#### Set toggle features configuration

You can set environment variables for toggle features (optional).

##### Enable reCaptcha (v2)

    RECAPTCHA_ENV=<site key>

##### Enable TOS check

    TOS_ENV=<terms of service uri>

##### Enable waiting list (and close sign up)

    WAITING_LIST_ENV=true

##### Enable crisp

    CRISP_ENV=<site key>

##### Export configuration for dev environment

Set variables locally, and run:

    $ npm run configuration

##### Run Docker image with variables

    $ docker run -p 8080:80 -d -e BACK_HOST="0.0.0.0" -e BACK_PORT="1234" -e <VARIABLE_ENV>=<value> kodokojo/kodokojo-ui:<version>

#### Customization

Some feature are customizable from environment variables.

##### Log level

By default it set to 'debug'. You can change it by setting:

    LOG_LEVEL_ENV=<level>    

Level can be one of the following:

- silly: no logs
- debug: all logs
- info: info and above
- warn: warn and above
- error: just error logs

## Installation

First install npm packages, build development files into static/, start webpack dev server on localhost:3000.

    $ NODE_ENV=development npm install


## Start Frontend

#### Development

    $ npm run start:dev

Then open ui project in browser.

    $ open http://localhost:3000


#### Local "production"

*If you want to test production build*

    $ npm run start:prod

Then open ui project in browser.

    $ open http://localhost:3000


#### Custom remote API configuration

You can use `API_PROTOCOL_ENV` and `API_HOST_ENV` to use an external Kodo Kojo backend api dns.

    $ export API_PROTOCOL_ENV=https://
    $ export API_HOST_ENV=kodokojo.mydomaine.com
    $ npm run start:custom

Then open ui project in browser.

    $ open http://localhost:3000


#### Custom production

Like custom environment (see above) but with production build:

    $ npm run start:local
    
Then open ui project in browser.

    $ open http://localhost:3000


#### Mocked API

To connect the frontend to mocked backend (just HTTP, not websocket for now). We use [kodokojo-mocks](https://github.com/kodokojo/kodokojo-mocks) for this. Configurations are in `mocks/` folder.

First start mock server in a terminal:

    $ npm run start:server:mock

Then start kodokojo-ui in an other terminal:

    $ npm run start:mock

Finally, open ui project in browser:

    $ open http://localhost:3000


### Start Backend

Except with custom and mock configurations, you will need to run Kodo Kojo backend to be able to test and develop locally.

##### Local cluster mode

To start the cluster locally, you have to go to kodokojo/kodokojo folder and start docker-compose:

    $ docker-compose -f src/test/resources/docker/full/docker-compose.yml up -d

##### AWS cluster mode

Then to start cluster located to an AWS, you have to go to kodokojo/kodokojo folder and start docker-compose (please be sure your docker-compose file is properly configured):

    $ docker-compose -f src/test/resources/docker/aws/docker-compose.yml up -d

Please [refers to proper documentation](https://github.com/kodokojo/kodokojo/blob/master/README.md) for explanation details.


## Build production release

Build production docker image of the front release.    
Note: works on OSX and Linux. For Windows users you have to run the build.sh script manually.

    $ npm run build:docker

It build the project, then put static/ content into /delivery/target/kodokojo-ui-\<version>.tar.gz and finally build the docker image with Nginx server (kodokojo/kodokojo-ui).


## Run styleguide

Build and run styleguide.

    $ npm run styleguide

Then open your browser.

    $ open http://localhost:9001


## Add license in source files headers

    $ npm run license


## Tests

Run tests.

    $ npm test

Run tests in watch mode.

    $ npm run test:watch

Run coverage.

    $ npm run coverage
    $ open ./coverage/lcov-report/index.html 

:heart: Thanks to all Open source projects which made such project possible!
