# vue-date-picker

# Prerequisite

## Install Node.js

You can download and install Node.js from `https://nodejs.org/en/`

## Install Vue Cli

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

# Development

## Install dependency

```
yarn
```

## Start developing server

```
yarn serve
```

# Deploy

## Deploy to github Page

1.  On your master branch, run the terminal command: `yarn run build:github`.

2.  Commit and Push

## Deploy not at the root of a domain

We will need to change `process.env.BASE_URL` when you build the bundle.

In addition, when refering files in `public` folder, you will need to use baseUrl as well.

https://cli.vuejs.org/guide/html-and-static-assets.html#the-public-folder
