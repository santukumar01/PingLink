const twilio = require("twilio");

const twilio_token_sid = process.env.TWILLIO_TOKEN_SID;
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// 1 .22 .07
