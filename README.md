Faubourg Simone: mobile applications [![Twitter Follow](https://img.shields.io/twitter/follow/faubourgsimone.svg?style=social&label=Follow)](https://twitter.com/faubourgsimone)
========

Sources of our web radio applications: android and ios with Ionic 2. 

[![Code Climate](https://codeclimate.com/github/FaubourgSimone/ionic-app/badges/gpa.svg)](https://codeclimate.com/github/FaubourgSimone/ionic-app)
[![Sonar quality gate](https://sonarcloud.io/api/badges/gate?key=faubourgsimone_ionic_app)](https://sonarcloud.io/dashboard?id=faubourgsimone_ionic_app)
[![Quality Gate Status](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=alert_status)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=alert_status)
[![Dependencies Status](https://david-dm.org/faubourgsimone/ionic-app/status.svg)](https://david-dm.org/faubourgsimone/ionic-app)
[![DevDependencies Status](https://david-dm.org/faubourgsimone/ionic-app/dev-status.svg)](https://david-dm.org/faubourgsimone/ionic-app?type=dev)
[![GitHub License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](https://raw.githubusercontent.com/FaubourgSimone/ionic-app/master/LICENSE)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Linter for the TypeScript](#linter-for-the-typescript)
- [Continuous Code Quality](#continuous-code-quality)
  - [Usage](#usage)
  - [A glance at our actual Sonarqube metrics](#a-glance-at-our-actual-sonarqube-metrics)
    - [Complexity](#complexity)
    - [Documentation & sizes](#documentation--sizes)
    - [Duplications](#duplications)
    - [Issues](#issues)
    - [Maintainability](#maintainability)
    - [Technical debt](#technical-debt)
    - [Reliability](#reliability)
    - [Security](#security)
- [Feel free to improve the app with us](#feel-free-to-improve-the-app-with-us)
- [Contribute](#contribute)
- [Support](#support)
- [License](#license)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---------------------


Demo
--------

<a href='https://play.google.com/store/apps/details?id=com.mfkr.faubourg.simone&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' width="150"/></a>

&nbsp;&nbsp;<a href='https://itunes.apple.com/fr/app/faubourg-simone-radio/id617687434&pcampaignid=GITHUB'><img alt='Get it on Apple Store' src='https://devimages-cdn.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg' width="132"/></a>

Features
--------
- Listening to our radio
- See content of our website: Pola / Calepins / Dans le casque


Installation
------------
Install the app by running:
```
npm install -g ionic cordova
npm i
ionic platform ios android
ionic state restore
```

Linter for the TypeScript
-------------------------
```
tslint --type-check --project tsconfig.json
```
*Note that our tslint config extends [SonarTS rules](https://www.sonarsource.com/products/codeanalyzers/sonarts.html)*


Continuous Code Quality
-----------------------
We use **[Sonarqube](https://www.sonarqube.org/)** on [Sonarcloud.io](https://about.sonarcloud.io/get-started/) to keep our code safe.
The dashboard is available here: [https://sonarcloud.io/dashboard?id=faubourgsimone_ionic_app](https://sonarcloud.io/dashboard?id=faubourgsimone_ionic_app)

### Usage

Be sure you have downloaded and installed the [Sonarqube Scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner).

You need to add sonar-project.properties to the root of the project as following:
```
sonar.projectName=Faubourg Simone Ionic App
sonar.projectKey=faubourgsimone_ionic_app
sonar.host.url=https://sonarcloud.io
sonar.organization=faubourgsimone-github
sonar.login=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
sonar.sources=src
sonar.java.source=1.8
sonar.java.binaries=.
```

When it's done, use the following command to generate results on the dashboard:

```
sonar-scanner -X -Dsonar.projectVersion=x.x.x
```

*Please contact us if you want a public login for our project.*


### A glance at our actual Sonarqube metrics

#### Complexity
How simple or complicated the control flow of the application is. 

[![Complexity](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=complexity)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=complexity) 
[![Complexity per file](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=file_complexity)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=file_complexity)
[![Cognitive Complexity](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=cognitive_complexity)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=cognitive_complexity)


Cyclomatic Complexity measures the minimum number of test cases requiref for full test coverage. 
Cognitive Complexity is a measure of how difficult the application is to understand

*Complexity for Javascript or typescript is incremented by one for each:*
- *function (i.e non-abstract and non-anonymous constructors, functions, procedures or methods)*
- *if statement*
- *short-circuit (AKA lazy) logical conjunction (&&)*
- *short-circuit (AKA lazy) logical disjunction (||)*
- *ternary conditional expressions*
- *loop*
- *case clauses of a switch statement*
- *throw and catch statement*
- *return statement (except when it is the very last statement of a function)*

*Complexity of the web page is measured by counting the decision tags (such as if and forEach) and boolean operators in expressions (&& and ||), plus one for the body of the document. 
The decision tags and the operators are configurable through the Complexity rule.*


#### Documentation & sizes

[![Lines](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=lines)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=lines) 
[![Lines of code](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=ncloc)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=ncloc) 
[![Comment lines](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=comment_lines)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=comment_lines) 
[![Comments (%)](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=comment_lines_density)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=comment_lines_density)

[![Directories](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=directories)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=directories) 
[![Files](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=files)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=files)
[![Classes](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=classes)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=classes) 
[![Functions](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=functions)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=functions)


#### Duplications

[![Duplicated blocks](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=duplicated_blocks)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=duplicated_blocks) 
[![Duplicated lines](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=duplicated_lines)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=duplicated_lines)


#### Issues

[![Open issues](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=open_issues)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=open_issues)
[![Confirmed issues](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=confirmed_issues)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=confirmed_issues)
[![Won't fix issues](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=wont_fix_issues)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=wont_fix_issues) 


#### Maintainability

Issues in this domain mark code that will be more difficult to update competently than it should

[![Code smells](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=code_smells)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=code_smells)
[![SQALE Rating](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=sqale_rating)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=sqale_rating)

Rating given to the project related to the value of the Technical Debt Ratio. 
The default Maintainability Rating grid is:
- A=0-0.05, 
- B=0.06-0.1,
- C=0.11-0.20, 
- D=0.21-0.5, 
- E=0.51-1

The Maintainability rating scale can be alternately stated by saying that if the outstanding remediation cost is:
* <=5% of the time that has already gone into the application, the rating is A 
* between 6 to 10% the rating is a B 
* between 11 to 20% the rating is a C 
* between 21 to 50% the rating is a D
* anything over 50% is an E

#### Technical debt
Effort to fix all maintainability issues. The measure is stored in minutes. An 8-hour day is assumed when values are shown in days. (The value of the cost to develop a line of code is 0.06 days)

[![Technical debt](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=sqale_index)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=sqale_index) 
[![Technical debt ratio](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=sqale_debt_ratio)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=sqale_debt_ratio)


#### Reliability

Issues in this domain mark code where you will get behavior other than what was expected.

[![Bugs](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=bugs)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=bugs)
[![Reliability remediation effort](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=reliability_remediation_effort)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=reliability_remediation_effort)
[![Reliability Rating](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=reliability_rating)

**Reliability remediation effort**

Effort to fix all bug issues. The measure is stored in minutes. An 8-hour day is assumed when values are shown in days.

**Reliability rating**

- A or 1 = 0 Bug
- B or 2 = at least 1 Minor Bug
- C or 3 = at least 1 Major Bug
- D or 4 = at least 1 Critical Bug
- E or 5 = at least 1 Blocker Bug


#### Security

[![Vulnerabilities](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=vulnerabilities)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=vulnerabilities)
[![Security remediation effort	](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=security_remediation_effort)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=security_remediation_effort)
[![Security Rating](https://sonarcloud.io/api/badges/measure?key=faubourgsimone_ionic_app&metric=security_rating)](https://sonarcloud.io/component_measures?id=faubourgsimone_ionic_app&metric=security_rating)


**Security remediation effort**

Effort to fix all vulnerability issues. The measure is stored in minutes in the DB. An 8-hour day is assumed when values are shown in days.

**Security rating**

- A = 0 Vulnerability
- B = at least 1 Minor Vulnerability
- C = at least 1 Major Vulnerability
- D = at least 1 Critical Vulnerability
- E = at least 1 Blocker Vulnerability



Feel free to improve the app with us
------------------------------------

- Run `ionic serve -l`
- We recommand to test your code by running `ionic run android` or `ionic run ios` to see results on simulators. If you're not familiar with Ionic framework, please read the Ionic documentation: [https://ionicframework.com/docs/](https://ionicframework.com/docs/)
- We use [commitizen](https://github.com/commitizen/cz-cli), so if you wanna contribute to the project and create a pull request, use it by running `git cz` instead of `git commit`.


Contribute
----------
- Issue Tracker: [https://github.com/FaubourgSimone/ionic-app/issues](https://github.com/FaubourgSimone/ionic-app/issues)
- Source Code: [https://github.com/FaubourgSimone/ionic-app](https://github.com/FaubourgSimone/ionic-app)

Support
-------
If you are having issues, please let us know: tech.team@faubourgsimone.com

License
-------
The project is licensed under the [GNU Affero General Public License v3.0 license](LICENSE)


Dependencies
------------

- [@angular/common](https://github.com/angular/angular): Angular - commonly needed directives and services
- [@angular/compiler](https://github.com/angular/angular): Angular - the compiler library
- [@angular/compiler-cli](https://github.com/angular/angular): Angular - the compiler CLI for Node.js
- [@angular/core](https://github.com/angular/angular): Angular - the core framework
- [@angular/forms](https://github.com/angular/angular): Angular - directives and services for creating forms
- [@angular/http](https://github.com/angular/angular): Angular - the http service
- [@angular/platform-browser](https://github.com/angular/angular): Angular - library for using Angular in a web browser
- [@angular/platform-browser-dynamic](https://github.com/angular/angular): Angular - library for using Angular in a web browser with JIT compilation
- [@angular/platform-server](https://github.com/angular/angular): Angular - library for using Angular in Node.js
- [@ionic-native/app-rate](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/app-version](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/background-mode](https://github.com/ionic-team/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/core](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/google-analytics](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/in-app-browser](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/media](https://github.com/ionic-team/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/music-controls](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/screenshot](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/social-sharing](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/splash-screen](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic-native/status-bar](https://github.com/driftyco/ionic-native): Ionic Native - Native plugins for ionic apps
- [@ionic/cloud-angular](https://github.com/driftyco/ionic-cloud-angular): Ionic Cloud Client for Angular 2
- [@ionic/storage](https://github.com/driftyco/ionic-storage): Ionic Storage utility
- [@ngx-translate/core](https://github.com/ngx-translate/core): The internationalization (i18n) library for Angular 2+
- [@ngx-translate/http-loader](https://github.com/ngx-translate/http-loader): A loader for ngx-translate that loads translations using http
- [angular2-swing](https://github.com/ksachdeva/angular2-swing): Angular 2 Component for Swing (Tinder style cards)
- [com.darktalker.cordova.screenshot](https://github.com/gitawego/cordova-screenshot): screenshot PhoneGap Plugin for Android
- [cordova-ios](https://git-wip-us.apache.org/repos/asf/cordova-ios.git): cordova-ios release
- [cordova-plugin-app-version](https://github.com/whiteoctober/cordova-plugin-app-version): Cordova plugin to return the version number of the current app
- [cordova-plugin-apprate](https://github.com/pushandplay/cordova-plugin-apprate): A plugin to provide rate this app functionality into your Cordova / Phonegap application&lt;br&gt;
- [cordova-plugin-background-mode](https://github.com/katzer/cordova-plugin-background-mode): Prevent app from going to sleep in background.
- [cordova-plugin-compat](https://github.com/apache/cordova-plugin-compat): This repo is for remaining backwards compatible with previous versions of Cordova.
- [cordova-plugin-console](https://github.com/apache/cordova-plugin-console): Cordova Console Plugin
- [cordova-plugin-device](https://github.com/apache/cordova-plugin-device): Cordova Device Plugin
- [cordova-plugin-dialogs](https://github.com/apache/cordova-plugin-dialogs): Cordova Notification Plugin
- [cordova-plugin-file](https://github.com/apache/cordova-plugin-file): Cordova File Plugin
- [cordova-plugin-globalization](https://github.com/apache/cordova-plugin-globalization): Cordova Globalization Plugin
- [cordova-plugin-google-analytics](https://github.com/danwilson/google-analytics-plugin): Google Universal Analytics Plugin
- [cordova-plugin-inappbrowser](https://github.com/apache/cordova-plugin-inappbrowser): Cordova InAppBrowser Plugin
- [cordova-plugin-media](https://github.com/apache/cordova-plugin-media): Cordova Media Plugin
- [cordova-plugin-music-controls](https://github.com/homerours/cordova-music-controls-plugin): Music controls for Cordova apps
- [cordova-plugin-splashscreen](https://github.com/apache/cordova-plugin-splashscreen): Cordova Splashscreen Plugin
- [cordova-plugin-statusbar](https://github.com/apache/cordova-plugin-statusbar): Cordova StatusBar Plugin
- [cordova-plugin-whitelist](https://github.com/apache/cordova-plugin-whitelist): Cordova Whitelist Plugin
- [cordova-plugin-x-socialsharing](https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin): Share text, images (and other files), or a link via the native sharing widget of your device. Android is fully supported, as well as iOS 6 and up. WP8 has somewhat limited support.
- [cordova-windows](https://github.com/apache/cordova-windows): cordova-windows release
- [es6-promise-plugin](https://github.com/vstirbu/PromisesPlugin): ES6-Promises polyfill for Cordova/PhoneGap
- [ionic-angular](https://github.com/driftyco/ionic): A powerful framework for building mobile and progressive web apps with JavaScript and Angular 2
- [ionic-plugin-deploy](https://github.com/driftyco/ionic-plugin-deploy): Ionic Deploy Plugin
- [ionic-plugin-keyboard](https://github.com/driftyco/ionic-plugin-keyboard): Ionic Keyboard Plugin
- [ionicons](https://github.com/driftyco/ionicons): Premium icons for Ionic.
- [ng2-translate](https://github.com/ocombe/ng2-translate): An implementation of angular translate for Angular 2
- [rxjs](https://github.com/ReactiveX/RxJS): Reactive Extensions for modern JavaScript
- [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox): Service Worker Toolbox provides some simple helpers for use in creating your own service workers.
- [zone.js](https://github.com/angular/zone.js): Zones for JavaScript
- [cordova-android](https://git-wip-us.apache.org/repos/asf/cordova-android.git): cordova-android release

Dev Dependencies
----------------

- [@ionic/app-scripts](https://github.com/driftyco/ionic-app-scripts): Scripts for Ionic Projects
- [@ionic/cli-plugin-cordova](https://github.com/ionic-team/ionic-cli): Ionic Cordova Plugin for Ionic CLI
- [@ionic/cli-plugin-ionic-angular](https://github.com/ionic-team/ionic-cli): Ionic CLI build plugin for Ionic Angular projects
- [commitizen](https://github.com/commitizen/cz-cli): Git commit, but play nice with conventions.
- [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog): Commitizen adapter following the conventional-changelog format.
- [tslint-sonarts](https://github.com/SonarSource/SonarTS): SonarTS rules for TSLint
- [typescript](https://github.com/Microsoft/TypeScript): TypeScript is a language for application scale JavaScript development

