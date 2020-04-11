# Igloo - The private social media

Prerequisites : <br>
node  [Install Node](https://nodejs.org/)<br>
mongo [Install Mongo](https://docs.mongodb.com/manual/installation/)<br>

Setup:

```npm i```

Setup MongoDB Compass to connect your database

In the root of igloo, in the folder called config, modify a file called default.json

In the default.json, setup the keys as -

```
{
  "mongoUri": <Your MongoDB Connection URI>,
  "jwtSecret": <Any secret key> ,
  "cookiesToken" : <Any string to use as key for cookies>
}
```

Similarly, in the server itself, there is a folder labelled email
Inside that, edit a file called mailCredentials.js
In that file, 

```
auth = {
  user: <any valid GMail email ID>,
  pass: <password to that GMail account>
}

module.exports = auth;

```


Now in the client folder, you'll find a file called config.js

In that, 

```
export const captchaKey = <Your captcha key>

```

You can get the captcha key from registering a captcha at https://www.google.com/recaptcha/admin/create

In the site, enter any name, choose reCaptcha v2

Under domains, add localhost

Click submit and you'll get the captcha key

You can run using `npm run dev` in the root folder, this starts the nodeJS server and client server.
However it is suggested you open two different terminals <br>
1. ```nodemon server.js``` in the first terminal, in the root of the server directory<br> 
2. cd into client in the other terminal, and ```run npm start``` over there
