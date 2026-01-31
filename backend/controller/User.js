import httpStatus from "http-status";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Meeting from "../models/Meeting.js";
import crypto from 'crypto';


 export const login = async (req, res) => {
  const { Username, Password } = req.body;

  try {
    const user = await User.findOne({ Username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "user is not valid" }); 
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

    const newUser = new User({
      Username,
      Password: hashPassword,
      Name,
    });

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

export const getUserHistory = async (req, res) => {
  const { Token } = req.query; 

  try {
    const foundUser = await User.findOne({ Token});
    
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
   const meetings = await Meeting.find({ UserId: foundUser._id}).populate('UserId');
    console.log("Meetings found for user:", meetings);

    res.status(httpStatus.OK).json({
      message: "User history found",
      user: {
        Username: foundUser.Username,
        Name: foundUser.Name,
      },
      meetings
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

        const newMeeting = new Meeting({
            UserId:user._id,
            Meetingcode,
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

