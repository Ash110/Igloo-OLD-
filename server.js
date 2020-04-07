const express = require('express');
const connectToDatabase = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('config')

//Initialise the server
const app = express();
app.use(helmet());

const cookieKey = config.get('cookiesToken');
//Initialise Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
// app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(cookieParser(cookieKey));
app.set('trust proxy', 1);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Connect to DB
connectToDatabase();
// app.get('/', (req, res) => res.send('The API is running'));

//Setting up routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/friends', require('./routes/api/friends'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profilePicture', require('./routes/api/profilePicture'));
app.use('/api/groups', require('./routes/api/groups'));
app.use('/api/feed', require('./routes/api/feed'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/search', require('./routes/api/search'));
app.use('/api/notifications', require('./routes/api/notifications'));
app.use('/api/pages', require('./routes/api/pages'));


// if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        try {
            const resolvingPath = path.resolve(
                __dirname,
                'client',
                'build',
                'index.html'
            );
            return res.sendFile(resolvingPath);
        } catch (err) {
            console.log(err)
            if (err.code === 'ENOENT') {
                const resolvingPath = path.resolve(
                    __dirname,
                    'client',
                    'build',
                    'errorPage.html'
                );
                return res.sendFile(resolvingPath);
            } else {
                throw err;
            }

        }
    });
// }

//Port
const PORT = process.env.PORT || 5000;

//Starting server
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

