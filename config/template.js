exports.signupEmail = (password, data) => {
  console.log("inside template");

  const message = {
    subject: "Account Registration",
    text: `Hi ${data.firstName} ${data.lastName}! Thank you for creating an account with us! Your Id is ${data.email} and password ${password}.`,
  };

  return message;
};
