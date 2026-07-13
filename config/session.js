const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("../lib/prisma");

const sessionConfig = {
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

module.exports = sessionConfig;
