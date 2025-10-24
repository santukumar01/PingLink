const User = require("../models/User");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/reponsHandler");
const sendOtpToEmail = require("../services/emailServices");

const twilioServices = require("../services/twillioPhoneNumber");

const genrerateToken = require("../utils/generateToken");

// sending otp
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

// verify Otp
const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return response(res, 404, "User not found");
      }

      const now = new Date();

      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 400, "Invalid or expired otp");
      }
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "PhoneNumber  and PhoneSuffix  are required");
      }
      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return response(res, 404, "User Not Found");
      }
      const result = await twilioServices.verifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return response(res, 400, "invalid Otp");
      }
      user.isVerified = true;
      await user.save();
      const token = genrerateToken(user?._id);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      return response(res, 200, "Otp  verfied Succesfully", { token, user });
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "internal server error");
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
// 1.50.54
