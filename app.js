require("dotenv").config;

const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/pool");
const bcrypt = require("bcryptjs");
const pgSession = require("connect-pg-simple")(expressSession);
const favicon = require("serve-favicon");

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
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day 
  })
);

// initialising the session
app.use(passport.session());

// Checking login middleware
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password); // using bcrypt.compare to check the password
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// storing the user session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// checking the user session
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.query("insert into users (username, password) values ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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