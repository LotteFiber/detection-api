const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

// TEST API
router.get("/api/", (req, res) => {
  res.json({ message: "Test API is worked" });
});

// SIGNIN
router.post("/api/signin", async (req, res) => {
  console.log(req.body);
  const { user_name, pass_word } = req.body;

  User.findOne({ user_name: user_name }).then((savedUser) => {
    bcrypt
      .compare(pass_word, savedUser.pass_word)
      .then((doMatch) => {
        console.log(doMatch);
        if (doMatch) {
          // res.json({message:"signin successfull"})
          const token = jwt.sign({ _id: savedUser._id }, SECRET);
          res.json({ token, savedUser });
        } else {
          return res
            .status(422)
            .json({ error: "Invalid username or password" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// SIGNUP
router.post("/api/signup", (req, res) => {
  console.log(req.body);
  const { user_name, pass_word } = req.body;
  if (!user_name || !pass_word) {
    return res.status(422).json({ error: "Please add all field" });
  }
  User.findOne({ user_name: user_name })
    .then((savedUser) => {
      if (savedUser) {
        console.log(savedUser);
        return res.status(422).json({ error: "User already exist" });
      }
      bcrypt.hash(pass_word, 12).then((hashedpassword) => {
        const user = new User({
          user_name,
          pass_word: hashedpassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Saved successfull" });
          })
          .catch((response) => {
            console.log(response);
          });
      });
    })
    .catch((response) => {
      console.log(response);
    });
});

// GET USERS
router.get("/api/getusers", async (req, res) => {
  const userList = await User.find().select("-pass_word");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// GET USER BY ID
router.get("/api/getuser/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-pass_word");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

// UPDATE USER
router.put("/api/user/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.pass_word) {
    newPassword = bcrypt.hashSync(req.body.pass_word, 10);
  } else {
    newPassword = userExist.pass_word;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      user_name: req.body.user_name,
      pass_word: req.body.newPassword,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("The user cannot be created!");

  res.send(user);
});

// DELETE USER
router.delete("/api/user/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
