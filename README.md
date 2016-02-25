# Angular.js Haven OnDemand client
[![Build Status](https://travis-ci.org/hpe-idol/angular-iod-client.svg?branch=feature%2Fplatform-v1)](https://travis-ci.org/hpe-idol/angular-iod-client)

## Overview 
HOD client for Angular.JS is a module which allow to easy integrate your project with HPE Haven OnDemand APIs.  
All API call are done on platform-v1 level.


This repo uses git-flow. develop is the development branch. master is the last known good branch.

## Installation

    bower install angular-iod-client


## Getting started 
* Include the package js file in your HTML file
* Add `iod-client` to your main module dependency list
* Set up your API-KEY to use on the calls using `iodEnvConfigService.setApiKey()`
* Use `iodHttpService` for the different HTTP calls 

## Services 

### iodEnvConfigService
This service is essential for the HOD tenant configurations. Calling `setApiKey()` with you API-KEY     

### iodHttpService
Expose the different HTTP method 

## Grunt tasks
* grunt : runs the test, and build tasks
* grunt test : Runs the Jasmine tests in Phantom JS
* grunt build : Generate a minified and uglified artifact under the dist folder
* grunt doc : Generates project documentation


## License
Copyright 2013-2015 Hewlett-Packard Development Company, L.P.

Licensed under the MIT License (the "License"); you may not use this project except in compliance with the License.
