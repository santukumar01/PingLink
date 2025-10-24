const twilio = require("twilio");

const dotenv = require("dotenv");
dotenv.config();

const serviceSid = process.env.TWILLIO_SERVICE_SID;
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// send otp to PhoneNumber

const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("Sending Otp to PhoneNumber", phoneNumber);
    if (!phoneNumber) {
      throw new Error("phone number is required");
    }
    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        // to: phoneNumber,
        to: phoneNumber,
        channel: "sms",
      });
    console.log("this is my response", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send Otp");
  }
};

// verify the Otp

const verifyOtp = async (phoneNumber, otp) => {
  try {
    console.log("this  is otp from service", otp);
    console.log("on this PhoneNumber", phoneNumber);

    const response = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });
    console.log("this is my response", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Otp verification failed");
  }
};

module.exports = {
  sendOtpToPhoneNumber,
  verifyOtp,
};
