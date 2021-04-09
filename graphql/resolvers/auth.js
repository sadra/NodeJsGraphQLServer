const bcrypt = require('bcrypt');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User does not exist!');
    }

    const userIsCorrect = await bcrypt.compare(password, user.password);

    if (!userIsCorrect) {
      throw new Error('Password is incorrect!');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
