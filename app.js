var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const orderRouter = require("./routes/orderRouter");
const foodItemRouter = require("./routes/foodItemRouter");
const ingredientRouter = require("./routes/ingredientRouter");
const uploadRouter = require('./routes/uploadRouter');


var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(
  () => console.log("Connected correctly to server"),
  err => console.log(err)
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

//API endpoints
app.use("/users", usersRouter);
app.use("/orders", orderRouter);
app.use("/fooditems", foodItemRouter);
app.use("/ingredients", ingredientRouter);
app.use('/imageUpload', uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
