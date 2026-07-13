const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

async function addNewUser(newUser) {
  const { email, password } = newUser;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

module.exports = { addNewUser };
