const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const user = require("../models/userModel"); // to interact with the DB

//@desc Register a User
//routes POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("userInformation", userName, email, password);
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await user.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered!");
  }
  //raw password should not store in dataBase directly use # password
  //for decrypting the password "npm i dcrypt"
  //hashing the password
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await user.create({
    userName,
    email,
    password: hashPassword,
  });

  console.log(`user created Succesfully ${newUser}`);
  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("user data is not vaild");
  }

  res.status(200).json({ message: "register the user" });
});

//@desc login a User
//routes POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userInfo = await user.findOne({ email });
  //compare password with hash password
  if (userInfo && (await bcrypt.compare(password, userInfo.password))) {
    // we need to pass acces jsn web token
    // console.log("userInfor", userInfo);
    const accessToken = jwt.sign(
      {
        //payload
        user: {
          userName: userInfo.userName,
          email: userInfo.email,
          id: userInfo._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not vaild");
  }
  //   res.status(200).json({ message: "login user" });
});
//@desc current User
//routes GET /api/user/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
