import httpStatus from "http-status";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Meeting from "../models/Meeting.js";
import crypto from 'crypto';
import { sendOTP } from "../utils/sendMail.js";


// user login
 export const login = async (req, res) => {
  const { Username, Password } = req.body;

  try {
    const user = await User.findOne({ Username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "user is not valid" }); 
    }

    if(!user.isVerified){
      return res.status(401).json({
        message:"Please verify email first"
      });
    }

    const validPassword = await bcrypt.compare(Password, user.Password);

    if (!validPassword) {
       return res.status(httpStatus.UNAUTHORIZED).json({ error: "Invalid password" });
    }
   const token = crypto.randomBytes(20).toString("hex"); 
    user.Token = token; 
    await user.save();
     

  return  res.status(httpStatus.OK).json({ message: "login successfully", Username: user.Username ,  Token: token});
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "user not found" });
  }
};


// user register
export const register = async (req, res) => {
  const { Username, Password, Name } = req.body;

  try {
    if (!Username || !Password || !Name) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: "All fields are required" }); 
    }

    const existUser = await User.findOne({ Username });

    if (existUser) {
      return res.status(httpStatus.CONFLICT).json({ error: "username is already exist" });
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = new User({
      Username,
      Password: hashPassword,
      Name,
      otp:"",
      isVerified:false
    });
 
    // await sendOTP(Username, otp);
    await newUser.save();
    res.status(httpStatus.CREATED).json({
      message: "register successfully",
      User: { Username: newUser.Username, Name: newUser.Name },
    });
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "not register successfully" });
  }
};

export const sendOTPAgain = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      Username: email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;

    await user.save();

    await sendOTP(email, otp);

    return res.status(200).json({
      message: "OTP Sent Successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to send OTP"
    });
  }
};

//verify the user gmail

export const verifyOTP = async (req,res)=>{

   const { email, otp } = req.body;

   const user = await User.findOne({
      Username: email
   });

   if(!user){
      return res.status(404).json({
         message:"User not found"
      });
   }

   if(user.otp !== otp){
      return res.status(400).json({
         message:"Invalid OTP"
      });
   }

  const token = crypto.randomBytes(20).toString("hex");

user.Token = token;
user.isVerified = true;
user.otp = "";

await user.save();

return res.status(200).json({
   message: "Verified Successfully",
   Token: token
});
}


// getUserHistory
export const getUserHistory = async (req, res) => {
  const { Token } = req.query; 

  try {
    const foundUser = await User.findOne({ Token});
    
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
   const meetings = await Meeting.find({ UserId: foundUser._id}).populate('UserId');

    res.status(httpStatus.OK).json({
      
      meetings: meetings.map(m=>({
        id: m._id,
        meetingCode: m.Meetingcode,
        date: m.Date ,
        user: m.UserId
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Server error while fetching history" });
  }
};


export const addToHistory = async (req, res) => {
    

    const { Token, Meetingcode } = req.body;

    try {
        const user = await User.findOne({ Token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const newMeeting = new Meeting({
            UserId: user._id,
            Meetingcode
        });

        await newMeeting.save();

        return res.status(201).json({
            message: "Added code to history"
        });

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });
    }
};

//create meeting

export const createMeeting = async (req,res)=>{

    try{

        const meetingCode =
        crypto.randomBytes(4).toString("hex");

        res.status(200).json({
            meetingCode
        });

    }catch(err){

        res.status(500).json({
            message:"Error creating meeting"
        });

    }
}



export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({
            Username: email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;

        await user.save();

        await sendOTP(email, otp);

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


export const verifyResetOTP = async (req, res) => {

    const { email, otp } = req.body;

    const user = await User.findOne({
        Username: email
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.resetOtp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    res.status(200).json({
        message: "OTP Verified"
    });

};


export const resetPassword = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({
            Username: email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        user.Password = hashPassword;
        user.resetOtp = "";

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
