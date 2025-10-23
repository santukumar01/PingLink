const User = require("../models/User");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/reponsHandler");
const sendOtpToEmail = require("../services/emailServices");
const { sendOtpToPhoneNumber } = require("../services/twillioPhoneNumber");

const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerate();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  let user;
  try {
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }

      user.emailOtp = otp;
      user.expiry = expiry;

      await user.save();
      await sendOtpToEmail(email, otp);
      return response(res, 200, "OTP send to your email ", { email });
    }

    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "PhoneNumber  and PhoneSuffix  are required");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;

    user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber, phoneSuffix });
    }
    await sendOtpToPhoneNumber(fullPhoneNumber);
    await user.save();

    return response(res, 200, "Otp send to your PhoneNumber", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
