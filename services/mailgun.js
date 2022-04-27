const mailgun = require("../config/mailgun");
const template = require("../config/template");

exports.sendEmail = async (email, password, type, host, data) => {
  console.log("service");
  let result;
  let response;

  try {
    const message = prepareTemplate(password, type, host, data);

    response = await mailgun.sendEmail(email, message);
  } catch (error) {}

  if (response) {
    result = response;
  }

  return result;
};

const prepareTemplate = (password, type, host, data) => {
  let message;
  console.log("prepareTemplate");
  switch (type) {
    case "signup":
      message = template.signupEmail(password, data);
      break;

    default:
      message = "";
  }

  return message;
};
