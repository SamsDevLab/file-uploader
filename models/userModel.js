const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

async function addNewUser(newUserData) {
  const { email, password } = newUserData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return newUser.id;
}

module.exports = { addNewUser };
