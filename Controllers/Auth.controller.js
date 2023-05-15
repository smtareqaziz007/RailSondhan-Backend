const { authSchema } = require("../helpers/validation_schema");
const User = require("../Models/Users.model");
const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt.helpers");
const client = require("../helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, isVerified } = req.body;
      const result = await authSchema.validateAsync({ email, password });

      const doesExist = await User.findOne({ email: result.email });
      // console.log(result);
      if (doesExist)
        throw createError.Conflict(result.email + " is already registered");

      // const user = new User({result.email, result.password, isVerified});
      const user = new User({
        email: result.email,
        password: result.password,
        isVerified,
      });

      const savedUser = await user.save();
      const userID = savedUser.id;

      const accessToken = await signAccessToken(userID);
      const refreshToken = await signRefreshToken(userID);
      console.log(refreshToken);
      res.send({ userID, accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("Username/password not valid");

      const userID = user.id;

      const accessToken = await signAccessToken(userID);
      const refreshToken = await signRefreshToken(userID);

      res.send({ userID, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
};
