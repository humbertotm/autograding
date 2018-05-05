#!/bin/bash
mvn test > std_out.txt
if [ $? -eq 0 ]; then
    cat target/surefire-reports/*.xml > xml.txt
    javac XmlToJson.java
    java XmlToJson
else
    javac src/main/java/*.java
fi