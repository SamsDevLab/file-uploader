const prisma = require("../lib/prisma");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user.id);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((userId, done) => {
    done(null, userId);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await prisma.findUnique({
        where: { id: id },
      });
      const user = rows[0];

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
