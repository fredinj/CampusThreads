# Required Server env variables

* DB = _mongodb-url_
* PORT = _port to run the server_
* JWT_SECRET = _jwt secret_
* EMAIL_PASS = _email pass for nodemailer_
* EMAIL_USER = _email for nodemailer_
* CLIENT_URL = _client's url_
* SERVER_URL = _server's url_
* NODE_ENV = _"production"_ (if in production)

# Required Client env variables

* VITE_SERVER_URL = _server's url_

# Config

* Add VITE_SERVER_URL to your .env file before building docker image for client. It has to be accessible when building so don't add the .env file to .dockerignore. It will be removed before the image is made.