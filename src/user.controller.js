const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require("./db")
const { ACCESS_SECRET, REFRESH_SECRET } = require("../config")

// redis could be used for keeping track of logged out users, as they'll need to log back in
const blackList = new Set()

const generateAccessToken = payload =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: "10m" })

const generateRefreshToken = payload =>
  jwt.sign(payload, REFRESH_SECRET)

module.exports = {
  async signin(req, res, next) {
    try {
      const { id, password } = req.body
      const user = await User.findOne({ where: { id } })
      const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash)
      if (passwordCorrect) {
        blackList.delete(id)
        return res.status(200).json({
          error: false,
          message: "Authorized",
          accessToken: generateAccessToken({ id }),
          refreshToken: generateRefreshToken({ id })
        })
      }
      return res.status(401).json({
        error: true,
        message: "Id or password is wrong"
      })
    } catch (err) {
      next(err)
    }
  },

  async newToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        return res
          .status(403)
          .json({
            error: true,
            message: "Refresh token required to get an access token"
          });
      }
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        if (blackList.has(decoded.id)) {
          return res
            .status(400)
            .json({
              error: true,
              message: "Logged out user must log in with id and password"
            })
        }
        return res
          .status(200)
          .json({
            error: false,
            accessToken: generateAccessToken({ id: decoded.id })
          })
      } catch (err) {
        return res
          .status(401)
          .json({
            error: true,
            message: "Invalid refreshToken"
          });
      }
    } catch (err) {
      next(err)
    }
  },

  async signup(req, res, next) {
    try {
      const { id, password } = req.body
      const passwordHash = await bcrypt.hash(password, 10)
      await User.create({ id, passwordHash })
      return res
        .status(201)
        .json({
          error: false,
          message: "User created",
          accessToken: generateAccessToken({ id }),
          refreshToken: generateRefreshToken({ id })
        })
    } catch (err) {
      next(err)
    }
  },

  async info(req, res, next) {
    try {
      return res
        .status(200)
        .json({ error: false, id: req.user.id })
    } catch (err) {
      next(err)
    }
  },

  async logout(req, res, next) {
    // logs out the user, he can't get new token until logs in with password,
    // but access token still valid until it is expired
    try {
      blackList.add(req.user.id)
      return res
        .status(200)
        .json({ error: false, message: "User Logged Out" })
    } catch (err) {
      next(err)
    }
  },
}
