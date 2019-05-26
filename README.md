# partEmatch - datingapp
NPM - Node - package.json 
Package with `camelCase` and `nodemon`

## Description
partEmatch is a dating-app that focusses on people that are visiting festivals and looking for other people that attend to the same festival. Each user can specify festivals they attend. Some users are looking for a romance where other just want to start friendships or find people to share festival experiences with.


## Installation
### 1. Clone the partEmatch repo
To clone the repo use the `git clone` command in youre favorite CLI:
`git clone https://github.com/Mokerstier/partEmatch-datingApp.git`

### 2. Install dependencies
Install al the required dependencies to be able to run the app on youre server:
`npm install`

### Configuration
Before you can use a `mongoDB` - database you'll have to make some configurations on pre hand:
create a `.env` - configure `DB_NAME`, `DB_HOST` and a `DB_PORT`
1. Open your CLI and run the following commands:
`touch .env`


### Usage camelCase
On your main JS file example: `index.js` add the following line to the top of the file
`const camelCase = require('camelcase')`
This package will be able to convert any strings to camelCase example: `cmd-proffesional` => `cmdProffesional` or
`CMD Proffesional` => `cmdProffesional`


### Usage nodemon

U run nodemon with the `npm run dev` command in the terminal

each time you save your .js file nodemon will run the file in the terminal. 
GGWP! No need to drag your index.html with script tags to the browser. EZ-life!
