require("dotenv").config();

const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const db = require("./db/pool");
const bcrypt = require("bcryptjs");
const pgSession = require("connect-pg-simple")(expressSession);
const favicon = require("serve-favicon");
const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const signupRouter = require("./routes/signupRouter");
const clubRouter = require("./routes/clubRouter");

const app = express();

// Serve Favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// views assets
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Creating session and cookies config
app.use(
  expressSession({
    store: new pgSession({
      pool: db, // Connection pool
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// require Auth middleware
require("./middleware/passport");

// initialising the session
app.use(passport.session());

// Routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/club", clubRouter);

// logout route
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log("404 for:", req.originalUrl);
  const err = new Error("Page not found");
  err.statusCode = 404;
  next(err); // Pass to error handler
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).render("error", {
    title: "Error",
    err,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
