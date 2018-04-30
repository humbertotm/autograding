#!/bin/bash

cat target/surefire-reports/*.xml > xml.txt
javac XmlToJson.java
java XmlToJson
