module.exports = {
  port: process.env.PORT || 5000,

  jwt: {
    secret: process.env.JWT_SECRET,
    tokenLife: "7d",
  },
};
