import fast2sms from "fast-two-sms";

const generateOTP = function generateOTP (otp_length) {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const sendSms = async function sendSms({ message, contactNumber }, next) {
  try {
    const res = await fast2sms.sendMessage({
      authoriztion: '3',
      message,
      numbers: [contactNumber],
    });
    console.log(res,'res(3)');
    return res;
} catch (error) {
    next(error);
  }
};

export {sendSms, generateOTP};
