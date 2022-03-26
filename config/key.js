module.exports = {
  port: process.env.PORT || 5000,

  jwt: {
    accessSecret: process.env.JWT_SECRET_ACCESS,
    accessTokenLife: "7d",
    // refreshSecret: process.env.JWT_SECRET_REFRESH,
    // refreshTokenLife: "1y",
  },
};
