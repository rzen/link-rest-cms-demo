# link-rest-cms-demo
A simple JAX RS project demonstrating the use of [LinkRest](https://github.com/nhl/link-rest) framework

* Requires Java 1.8 or newer
* Requires a servlet 3.1 container (though will probably work on 3.0) 

If you want to build a real app based on this example, start by cloning the project on GitHub and then make the following changes:

* Instead of using an in-memory Derby database, you may want to switch to a real one. After this is done, you will need to scrub the code of all the references to Derby.
* You will need to change Cayenne model to match your DB schema (or maybe switch to [cdbimport](http://cayenne.apache.org/docs/3.1/cayenne-guide/including-cayenne-in-project.html#maven-projects)).

## Pre-requisites

Sencha Cmd v5.1.2.52

Java 1.8

## Building

Clone this demo and package it:

    git clone https://github.com/rzen/link-rest-cms-demo.git
    cd link-rest-cms-demo
    mvn clean package

## Running

    mvn jetty:run

Open demo URL http://localhost:8080/cms/ in the browser:

![](https://raw.githubusercontent.com/rzen/link-rest-cms-demo/master/demo.png)