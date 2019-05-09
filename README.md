# Package-boilerplate
NPM - Node - package.json 
Package with `camelCase` and `nodemon`

## Dependencies
[camelCase v5.3.1](https://www.npmjs.com/package/camelcase)

### Installation

`npm install camelCase`

### Usage
On your main JS file example: `index.js` add the following line to the top of the file
`const camelCase = require('camelcase')`
This package will be able to convert any strings camelCase example: `cmd-proffesional` => `cmdProffesional` or
`CMD Proffesional` => `cmdProffesional`

## devDependencies

[nodemon v1.19.0](https://nodemon.io/)

### Installation

`npm install --save-dev nodemon`

the `--save-dev` prefix will add it to the devDependecies branch in your `package.json`

### Usage

U run nodemon with `nodemon [your node app]`

each time you save your .js file nodemon will run the file in the terminal. 
GGWP! No need to drag your index.html with script tags to the browser. EZ-life!
