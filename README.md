
# Kodo Kojo UI

This is the UI for Kodo Kojo project

[![Join the chat at https://gitter.im/kodokojo/kodokojo](https://badges.gitter.im/kodokojo/kodokojo.svg)](https://gitter.im/kodokojo/kodokojo?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## License

`kodokojo-ui` is a licensed under [GNU General Public License v3](http://www.gnu.org/licenses/gpl-3.0.en.html).

## Contribute

Please, read following [Contribution page](CONTRIBUTING.md).

## Prerequiste

- NodeJS (see package.json file for version).
- Consider using nvm to switch node version in development easily.
- Docker 1.8 or newer.
- A working build of [kodokojo](https://github.com/kodokojo/kodokojo) project.

## Installation & build

### Development

You have to set two environment variables.
If you are running Kodo Kojo backend in local mode, set variables as follow:

    NODE_ENV=development
    BABEL_ENV=development
    BUILD_ENV=development
    
If you are running Kodo Kojo backend that reroute to AWS instance, set variables as follow:  

    NODE_ENV=development
    BABEL_ENV=production
    BUILD_ENV=development


First install npm packages, build development files into static/, start webpack dev server on localhost:3000.

    $ npm install
    $ eval $(docker-machine env default) // mount docker env variables
    $ npm run start:dev
    
Then open ui project in browser.

    $ open http://localhost:3000


In any case, you will need to run Kodo Kojo backend to be able to test and develop locally, please [refers to proper documentation](https://github.com/kodokojo/kodokojo/blob/master/README.md) for explanation details.


### Local "production"

*If you want to test production build*

Set environment variables to:  

    NODE_ENV=development
    BABEL_ENV=production
    BUILD_ENV=production

Install npm packages, build production files into static/, start webpack dev server on localhost:3000.

    $ npm install
    $ npm run start:prod
    
Then open ui project in browser.

    $ open http://localhost:3000


### Build production release

Build production tar.gz release: it build the project, then put static/ content into /delivery/kodokojo-ui-<version>.tar.gz.


    $ ./build.sh
    

:heart: Thanks to all Open source projects which made such project possible!
