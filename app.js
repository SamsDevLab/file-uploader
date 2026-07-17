require("dotenv");
const express = require("express");
const app = express();
const path = require("node:path");
const passport = require("passport");
const session = require("express-session");
const sessionConfig = require("./config/session");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const errorHandler = require("./middleware/errorHandler");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(sessionConfig));
app.use(passport.session());

require("./config/passport")(passport);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
