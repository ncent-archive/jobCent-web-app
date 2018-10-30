const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
        key: "session_token",
        secret: "somesecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000
        }
    })
);

app.use((req, res, next) => {
    if (req.cookies.session_token && !req.session.user) {
        res.clearCookie('session_token');
    }
    next();
});

require("./server/routes")(app);

app.get("*", (req, res) =>
    res.status(200).send({
        message: "Welcome to the jobCent server."
    })
);

module.exports = app;