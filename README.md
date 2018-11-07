<p align="center">
  <a href="#"><img src="./docs/logo-word.png" /></a>
</p>

<div align="center">

[![npm version](https://badge.fury.io/js/canner.svg)](https://badge.fury.io/js/canner)
[![npm download](https://img.shields.io/npm/dm/canner.svg)](https://www.npmjs.com/package/canner)
[![CircleCI branch](https://img.shields.io/circleci/project/github/Canner/canner/master.svg)](https://circleci.com/gh/Canner/canner)
[![](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/Canner/CannerCMS?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/canner)
[![Twitter Follow](https://img.shields.io/twitter/follow/cannerIO.svg?style=social&label=Follow)](https://twitter.com/cannerIO)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Universal%20CMS%20framework%20in%20React%20JSX(XML-like)%20for%20Firebase%2C%20GraphQL%2C%20Restful%20API%2C%20Prisma%20using%20%40cannerIO%2C%20open%20source%20at%3A%20https%3A%2F%2Fgithub.com%2FCanner%2Fcanner)

</div>

<br/><br/>
> Canner, an agile Content Management System for APIs and Clouds. Build CMS faster and simpler with GraphQL, Prisma, Firebase and Restful APIs.


## Benefits and advantages (Simple. Agile. Flexible. Efficient - SAFE)

### 🌍 Simple, One Framework

Canner is flexible and agnostic, that you can ***learn once and create any form of CMS for many different databases.***

### ⚡️ Agile, Move Faster

By defining a Canner schema in JSX, you can determine how the CMS stores data in your databases and the appearance of the CMS UI/UX.

### 💪 Flexible, any Data Sources

With different connectors, you are able to create a CMS to interact with ***Firebase, MySQL, PostgreSQL, GraphQL with the same schema***.

### 💸 Efficient, Less is More

Since Canner schema ***is only a JSX (XML-like) language without any logistic code***, in other words, you can maintain your code in a configuration file and easy to maintain using version controls.

## Why Canner is different?

Canner adopts Adaptive CMS concept. Adaptive CMS is a new CMS structure that is different from traditional CMS and headless CMS. The biggest different about Adaptive CMS is that it decouples both view and data layer. It builds data interfaces to connect to single or multiple data sources.

> ***Adaptive CMS?*** Learn more [here](https://www.canner.io/docs/why-adaptive-cms)

![overview](http://www.canner.io/docs/assets/revolution.png)

***LOVE OUR IDEA AND CONCEPT? STAR OUR PROJECT 🌟🌟 AND [![Twitter Follow](https://img.shields.io/twitter/follow/cannerIO.svg?style=social&label=Follow)](https://twitter.com/cannerIO)***

## Return on Investment

![roi](./docs/roi.png)

> Canner can reduce up to 80% of your current CMS solutions.

You only need to upload a configuration file in JSX(easy to learn) syntax, to create any kind and form of applications. Our CMS has built CMS for websites, mobile apps, and even chatbot applications. **Amazingly, you can building a blog CMS within 200 lines of code, as for basic E-commerce CMS within 300 lines of code using Canner.** See what you can accomplish within 1500 lines of code, see [this demo](https://www.canner.io/demo) ([Source code](https://github.com/Canner/canner/tree/canary/docs)) .

## Preview and demo

***Live demo here: https://www.canner.io/demo***

Code lives in [here ./docs folder](./docs)

![CMS preivew1](./docs/preview1.png)

> Charts and Indicators

![CMS preivew1](./docs/preview2.png)

> Inline updates, tables, sorters, filters, etc...

![CMS preivew1](./docs/preview3.png)

> Import & export data, multiple selection, etc...

## Features

### CMS features

- [x] [30+ CMS components](https://www.canner.io/component)
- [x] [Support Layouts](https://www.canner.io/docs/schema-layout-tags)
- [x] [Support Queries](https://www.canner.io/docs/schema-toolbar-tags)
- [x] [Support Chart](https://www.canner.io/docs/schema-page-tags)
- [x] [Support i18n](https://www.canner.io/docs/guides-internationalization)
- [x] [Support Validation](https://www.canner.io/docs/guides-validation)
- [x] [Support Condition](https://www.canner.io/docs/guides-condition-fields)
- [x] [Support Customization](https://www.canner.io/docs/guides-customized-component)

### Sources and API

- [x] [Connect to multiple sources](https://www.canner.io/docs/credential-intro)
  * [Firebase](https://www.canner.io/docs/credential-firebase)
  * [Firestore](https://www.canner.io/docs/credential-firestore)
  * [Prisma](https://www.canner.io/docs/credential-prisma)
- [x] [Customize resolver](https://www.canner.io/docs/guides-resolver)
- [x] [Storage API support](https://www.canner.io/docs/guides-storage)


## 🔥🔥 Only 3 commands to start 🔥🔥

```sh
# 1. Download Canner CLI tool
➜ $ npm install --global @canner/cli

# 2. Initialize schema
➜ $ canner init:schema
# Answer the questions
# Initializing schema...
# ? What template do you want to create? (Use arrow keys)
#   None
# ❯ Blog
#   Company
#   E-commerce
# ? What data source do you want to use?
#   None
#   Firebase admin
#   Firebase client
# ❯ Prisma
✔ Initialized

# 3. Serve your CMS with Livereload in local, while you update your schema the dev server will automatically reload open http://localhost:9090
➜ $ canner script:serve
```

***👉👉 START USING CANNER: https://www.canner.io***

### Learn more about Canner.

* ***Why create Canner?*** See [here](https://www.canner.io/docs/why-canner)

* ***Our mission at Canner:*** See [here](https://www.canner.io/docs/why-mission.html)


## Demo

### Canner connect to Firebase

CMS for Firebase with SSR supported (NextJS) https://github.com/Canner/canner-firebase-cms

### Canner connect to Firestore

CMS with Canner and Firestore, and deploy to Firebase hosting https://github.com/Canner/canner-firebase-cms


**More demo visit [/examples folder](./examples) & [canner-demo](https://github.com/Canner/canner-demo) and  [canner.io](https://www.canner.io/)**

### Instructions
- Firebase - realtime database: https://www.canner.io/docs/tutorial-connect-to-firebase
- Prisma: https://www.canner.io/docs/tutorial-connect-to-prisma

### Blog posts

- Step by Step tutorial: https://www.canner.io/docs/start-quick-html5up
- Why Firebase CMS: https://www.canner.io/docs/why-firebase-cms

## Develop

Install all dependencies.

We are using yarn workspace to manage all repos, learn more about [Yarn workspace](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/)

To install packages

```
yarn
```


## License

Apache-2.0

![footer banner](https://user-images.githubusercontent.com/26116324/37811196-a437d930-2e93-11e8-97d8-0653ace2a46d.png)
