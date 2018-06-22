![logo](./docs/logo-word-alpha.svg)

[![](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/Canner/CannerCMS?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

> Build CMS in few lines of code for different data sources

Why create Canner?

> ***Most developers struggle with building maintainable and extendable CMS, so we design an CMS framework that you can build CMS with only few lines of code and interact with different data sources.***

Before we built Canner CMS framework, we've tried most of CMS framework such as Wordpress, Drupal, etc. What we found was that getting simple functions to work was easy enough, but once you try to build and scale into your product or your service you ran into deeper issues...

1. **Humongous code base:**  Each CMS framework is humongous and complex, if you want to use them you have to install a huge code base into your system, and most of the time it'll affect and mess with all your existing code.

2. **Hardcoded and limited APIs:**  APIs should not predefined and even hard coded into codebase, which is critical for building advanced use cases and impossible to build into your system.

3. **Re-inventing the view layer seemed inefficient and limiting:**  Most CMS rolled their own views, instead of using existing technologies like `React`, so you have to learn a whole new system, in order to make some changes.

4. **CMS are binded with frontend code:**  Many CMS bind with frontend code, so there are many needless and complex conventional namings and settings in your codebase, you have to learn all the system before design your theme.

5. **Vendor lock-in:** Many CMS are lock into a specific database and service, it's impossible to switching existing cloud services or databases later.

6. **Building complex, nested CMS was impossible:** Many CMS are design for simple use cases such as blog, ecommerce websites. As your service grow larger and complex, you'll run into several bottlenecks to grow your CMS that fits.

7. **Building CMS fit your APIs was impossible:** Most CMS are **not purely** CMS, they are design for building templates in it's own structure and platform.  So it's nearly impossible to build CMS that fit into your existing infrastructure.

8. **Design CMS structure is like managing a huge code base:** Maintaining your CMS structure is like mess with huge code base with lots of conventions that you must follows.

Of course not every CMS exhibits all these issues, but if you tried using another CMS you might have run into similar problems.

If that sounds familiar, you might like ***Canner***. Which motivates us to solve these problems.

> If you are interested in how we solve these problems see [Our mission](https://www.canner.io/docs/why-mission.html)

***START USING CANNER: https://www.canner.io***

## Features

### 1. Declare in JSX

Canner CMS schema is developed in JSX that enables developers to build simple and powerful CMS.

### 2. Open source CMS

Canner CMS is all open source on Github, and maintained by community.

### 3. On Top of Apollo GraphQL

Canner CMS is built on top of Apollo and uses GraphQL internally, to help build robust and flexible data interfaces.

### 4. Data is yours

Instead of hosting your data on our platform, Canner CMS builds adapters that connect to biggest backend providers so that you own your data.

### 5. CMS component as a unit

Canner CMS is constructed with CMS components. Developers can pick components to assemble CMS interfaces.

### 6. Code as CMS structure

Canner CMS provides flexible CMS infrastructure, allowing developers to assemble CMS interface that adapts to their specifications.

## Adaptive CMS Framework

Adaptive CMS is a novel CMS structure that differs from traditional CMS and headless CMS. The biggest difference is that Adaptive CMS decouples the view and data layers and builds data interfaces to connect to single or multiple data sources.

![overview](http://www.canner.io/docs/assets/revolution.png)

> Learn more [Why Adaptive CMS?](http://www.canner.io/docs/why-adaptive-cms.html)

## Demo

### Canner connect to firebase

- live demo: https://fir-cms-15f83.firebaseapp.com/login
- repo: https://github.com/Canner/canner-firebase-cms

## Links

Visit our [Canner official document](https://www.canner.io/docs) to get started

And also visit our [CannerIO platform](https://www.canner.io)

## License

Apache-2.0

![footer banner](https://user-images.githubusercontent.com/26116324/37811196-a437d930-2e93-11e8-97d8-0653ace2a46d.png)