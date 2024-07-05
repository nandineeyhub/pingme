const asyncHandler = require("express-async-handler");
const user = require("../Model/userSchema");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path")

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  //check if every required field exists
  if (!name || !email || !password) {
    res.status(200).json({
      status: true,
      message: "Please provide all required fields",
    });
  }
  //check if user already exist
  const userExist = await user.findOne({ email });

  if (userExist) {
    res.status(200).json({
      status: true,
      message: "User already exists",
    });
  }
  //generate salt and make hash
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(password, salt);
  // create user
  const newuser = await user.create({
    name: name,
    email: email,
    profilePicture: "",
    password: hash,
  });
  //send response accordingly
  if (newuser) {
    res.status(200).json({
      data: {
        id: newuser?._id,
        name: newuser?.name,
        email: newuser?.email,
        profilePicture: "",
      },
      status: true,
      message: "Account created Successfully",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Invalid user data",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if every required field exists
  if (!email || !password) {
    res.status(200);
    throw new Error("Please fill all required field");
  }
  //check if every required field exists
  const newuser = await user.findOne({ email });
  //check if every required field exists and password matches
  if (newuser && (await bycrypt.compare(password, newuser?.password))) {
    res.status(200).json({
      data: {
        _id: newuser.id,
        name: newuser.name,
        email: newuser.email,
        profilePicture: newuser.profilePicture,
        token: generateToken(newuser._id),
      },
      status: true,
      message: "Happy Socialising!",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Invalid credentials",
    });
  }
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  console.log(req.file)
  const imagePath = req.file.filename;
  const userId = req.user;
  const activeUser = await user.findOne({ _id: userId });

  if (activeUser.profilePicture != null) {
    deleteFile(path.join(__dirname,"../uploads",activeUser.profilePicture), req.user);
  }

  const newdata = await user.findByIdAndUpdate(userId, {
    profilePicture: imagePath,
  });
  
  console.log(newdata)

  if (!newdata) {
    res.status(200).json({ status: true, message: "Invalid Request" });
  } else {
    res
      .status(200)
      .json({ status: true, message: "Profile picture uploaded.", data:{ fileName:imagePath} });
  }
});

const getPicture = asyncHandler(async (req, res) => {
  const imageName = req.params.imageName;
  const location = path.join(__dirname, "../uploads", imageName)
  res.sendFile(location);
});

const removeProfilePicture = asyncHandler(async (req, res) => {
  const activeUser = await user.findOne({ _id: req.user });
  let imagePath;
  if (activeUser) {
    if (activeUser.profilePicture === null) {
      res
        .status(200)
        .json({
          status: true,
          message: "No profile picture found to be removed.",
        });
      return;
    }
    console.log(activeUser);
    imagePath = activeUser.profilePicture;
  }

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(200).json({ status: true, message: "Something went wrong" });
    }
    // Delete the file
    fs.unlink(imagePath, async (err) => {
      if (err) {
        res
          .status(200)
          .json({ status: true, message: "Something went wrong" });
      }
      const newdata = await user.findByIdAndUpdate(req.user, {
        profilePicture: null,
      });
      if (newdata)
        res
          .status(200)
          .json({ status: true, message: "Profile picture removed." });
      else
        res
          .status(200)
          .json({ status: true, message: "Something went wrong" });
    });
  });
});

const getMe = asyncHandler(async (req, res) => {
  if (req.user) res.status(200).json(req.user);
  else res.status(200);
});

const updateMe = asyncHandler(async (req, res) => {
  const userId = req?.user;
  const newdata = await user.findByIdAndUpdate(userId, req.body);
  if (newdata) {
    res.status(200).json({ status: true, message: "Profile updated." });
  } else
    res.status(200).json({ status: true, message: "Something went wrong" });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const deleteFile = (imagePath) => {
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
    }
    // Delete the file

    fs.unlink(imagePath, (err) => {
      if (err) {
      }
    });
  });
};

const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await user
    .find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  if (users) {
    res.status(200).json({
      status: true,
      data: users,
      message: "All Users List.",
    });
  } else
    res.status(200).json({ status: true, message: "Something went wrong" });
});

module.exports = {
  registerUser,
  login,
  getMe,
  uploadProfilePicture,
  removeProfilePicture, 
  allUser,
  updateMe,
  getPicture,
};
