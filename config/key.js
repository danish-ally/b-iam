module.exports = {
  port: process.env.PORT || 5000,

  jwt: {
    accessSecret: process.env.JWT_SECRET_ACCESS,
    accessTokenLife: "7d",
    // refreshSecret: process.env.JWT_SECRET_REFRESH,
    // refreshTokenLife: "1y",
  },
  // mailchimp: {
  //   key: process.env.MAILCHIMP_KEY,
  //   listKey: process.env.MAILCHIMP_LIST_KEY
  // },
  mailgun: {
    key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    sender: process.env.MAILGUN_EMAIL_SENDER
  },
};
