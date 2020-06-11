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
app.use(function (req, res, next) { req.headers.origin = req.headers.origin || req.headers.host; next(); })
app.use(cookieParser(cookieKey));
var allowedOrigins = ['http://localhost:5000', 'http://127.0.0.1:5000',
'https://www.igloosocial.com','https://igloosocial.com','igloosocial.com', 'www.igloosocial.com'];
app.use(cors({
    origin: function (origin, callback) {
        console.log(origin)
        console.log(allowedOrigins.indexOf(origin))
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 ) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.set('trust proxy', 1);
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
app.use('/api/stats', require('./routes/api/stats'));


//Mobile routes
app.use('/mobile/users', require('./routes/mobile/users'));
app.use('/mobile/friends', require('./routes/mobile/friends'));
app.use('/mobile/posts', require('./routes/mobile/posts'));
app.use('/mobile/profilePicture', require('./routes/mobile/profilepicture'));
app.use('/mobile/groups', require('./routes/mobile/groups'));
app.use('/mobile/feed', require('./routes/mobile/feed'));
app.use('/mobile/comments', require('./routes/mobile/comments'));
app.use('/mobile/search', require('./routes/mobile/search'));
app.use('/mobile/notifications', require('./routes/mobile/notifications'));
app.use('/mobile/pages', require('./routes/mobile/pages'));
app.use('/mobile/stats', require('./routes/mobile/stats'));

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

