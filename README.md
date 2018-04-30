# Running the app

To run this app, make sure you have installed Docker.

Once you have cloned the repo, navigate to its root directory and execute the following command to build the Docker image:

```
$ docker build -t autograding .
```

This command will build an image abd tag it as `autograding`.

Once the image is built, run the app by creating a Docker container. Execute the following command to achieve this:

```
$ docker run -it -p <port-of-your-choice>:3000 autograding
```

# Taking it for a test drive...

To try it out, you will find the folder `testcode` in the root directory of the project. In this folder, you will find three different files which will serve as test input for the app. Use your favorite tool to simulate HTTP requests (Postman, for example), and make a `POST` request to the following url: `http://localhost:3000/compile`.

The body of the request should simulate data retrieved from a form with the following fields, and respective values:

**Fieldname:** `codefile`

**Type:** `File`

**Value:** Any of the files in the `testcode` folder.





**Fieldname:** `langid`

**Type:** `Text`

**Value:** The matching value for the language to test.



### Language Ids


**Javascript:** 0

**Java:** 1

**Ruby:** 2
