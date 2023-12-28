import { Config } from "../dbConfig/config.js";
import Admin from "../model/adminSchema.js";
import User from "../model/userSchema.js";
import jwt  from "jsonwebtoken";
import { generateOTP, sendSms } from "../utils/otp.util.js";
import sendMail from "../utils/mailer.js";
// import { encrypt, compare } from "../services/crypto";

Config()

const signup = async function signup (req,res,next) {
    try {
        console.log(req.body,'1 req.body');
        const {name, email, password, phone} = req.body;
        console.log(name,phone,'name(1)');
        const validateUserExists = await findUserByEmail(email);
        if (!(phone[0] === '6' || phone[0] === '7' || phone[0] === '8' || phone[0] === '9')) {
            return res.status(400).json({
                message: 'invalid phone number',
                phone
            })
        }

        console.log(phone.length,'phone length');

        if (validateUserExists?.length > 0) {
            throw new Error('user already exists')
        }

        // create user by verifying otp by email
        const newUser = await createUser(email,password);
        if (!newUser[0]) {
            return res.status(400).send({
              message: "Unable to create new user",
            });
          }
        res.status(201).json({
            message: `${name} signed up successfully and otp has been sent to your registerd mobile number`,
            success: true,
            body: {
                newUser
            }
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// to verify email user
const verifyEmail = async function (req, res) {
    const { email, otp } = req.body;
    const user = await validateUserSignUp(email, otp);
    res.send(user);
  };
  
const findUserByEmail = async (email) => {
   const user = await User.findOne({
     email,
   });
   if (!user) {
     return false;
   }
   return user;
};
  
  const createUser = async (email, password) => {
    // const hashedPassword = await encrypt(password);
    // const otpGenerated = generateOTP();
    const otp = generateOTP(6);
    const newUser = await User.create({
      email,
      password: password,
      otp: otp,
    });
    console.log(newUser,otp,email,password,'237942332')
    if (!newUser) {
      return [false, "Unable to sign you up"];
    }
    try {
        await sendMail({
          to: email,
          OTP: otp,
        });
        return [true, newUser];
      } catch (error) {
        return [false, "Unable to sign up, Please try again later", error];
      }
  };
  
  const validateUserSignUp = async (email, otp) => {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return [false, "User not found"];
    }
    if (user && user.otp !== otp) {
      return [false, "Invalid OTP"];
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $set: { active: true },
    });
    return [true, updatedUser];
  };


const signIn = async function signIn(req,res) {
    try {
        const { password, phone } = req.body;
        console.log(phone.length,phone[0],'name(1)');
        const validateUserExists = await User.findOne({phone});
        if(password !== validateUserExists.password) {
            return res.status(401).json({
                message: 'unauthorized user'
            })
        }
        if (!(phone[0] === '6' || phone[0] === '7' || phone[0] === '8' || phone[0] === '9')) {
            return res.status(400).json({
                message: 'invalid phone number',
                phone
            })
        }
        console.log(phone.length,validateUserExists,'phone length');
        if (validateUserExists.length === 0) {
            return res.status(400).json({
                message: `phone: ${validateUserExists.name} doesn't exists in db`
            })
        }
        res.status(201).json({
            message: `${validateUserExists.name} signed in successfully`,
            success: true,
            body: {
                validateUserExists,
            }
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Admin signup to admin panel
const adminSignup = async function adminSignup (req,res) {
    try {
        const {name, email, password, role} = req.body;
        console.log(name,'name(1)');
        const validateUserExists = await Admin.findOne({email});
        if (validateUserExists?.length > 0) {
            throw new Error(`admin with name: ${name} user already exists`)
        }
        const newUser = new Admin ({
            name,
            email,
            password,
            role
        });
        const savedData = await newUser.save();
        console.log(savedData,'data saved successfully (1)');
        if(!savedData) {
            throw new Error ('internal server error');
        }
        return res.status(201).json({
            message: `Admin signed up successfully`,
            success: true,
            body: {
                email,
                name,
                role
            }
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Admin sigIn with authorized role
const adminSignIn = async function adminSignIn(req,res) {
    try {
        const { password, email } = req.body;
        console.log(email,'name(1)');
        const validateUserExists = await Admin.findOne({email});
        if(password !== validateUserExists.password) {
            return res.status(401).json({
                message: 'unauthorized user'
            })
        }
        const token = `Bearer ` + generateAuthToken(validateUserExists);
        return res.status(201).json({
            message: `${validateUserExists.name} signed in successfully`,
            success: true,
            token
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Role with admin can only view the records from db
const getUsers = async function getUsers(req,res) {
    try {
        console.log('role-->' , req.user.role);
        if (req.user && req.user.role === 'admin') {
        const users = await User.find();
        return res.status(200).json({
            body: {
                users
            }
        })
    }
    } catch (err) {
        console.log(err,'err')
        throw new Error('unauthorized')
    }
}

const uploadFile = async function (req,res) {
    try {
        return res.json({
            message: 'file uploaded successfully'
        })
    } catch (err) {
        console.log(err);
    }
}


const downloadImage = async function downloadImage (req,res) {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '../uploads/', fileName);
        return res.download(filePath, (err) => {
            if (err) {
              res.status(404).json({ message: 'File not found' });
            }
          });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const generateAuthToken = (admin) => {
    const JWT_SECRET = 'admin';
    const token = jwt.sign({ _id: admin._id, name: admin.name, role: admin.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  };

// const verifyPhoneOtp = async function verifyPhoneOtp (req, res, next) {
//     try {
//       const { otp, userId } = req.body;
//       const user = await User.findById(userId);
//       if (!user) {
//         next({ status: 400, message: USER_NOT_FOUND_ERR });
//         return;
//       }
  
//       if (user.phoneOtp !== otp) {
//         next({ status: 400, message: INCORRECT_OTP_ERR });
//         return;
//       }
//       const token = createJwtToken({ userId: user._id });
  
//       user.phoneOtp = "";
//       await user.save();
  
//       res.status(201).json({
//         type: "success",
//         message: "OTP verified successfully",
//         data: {
//           token,
//           userId: user._id,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

export {signup, signIn, adminSignup, adminSignIn, getUsers, uploadFile, downloadImage, verifyEmail};