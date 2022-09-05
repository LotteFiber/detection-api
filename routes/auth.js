const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

router.get("/api/", (req, res) => {
  res.json({ message: "this is auth" });
});

router.post("/api/signin", async (req, res) => {
  console.log(req.body);
  const { user_name, pass_word } = req.body;

  // const foundUser = await User.findOne({ user_name }).exec();
  // console.log(foundUser);
  // if (!foundUser) {
  //   return res.status(422).json({ error: "Not found username" });
  // }

  // if (pass_word === foundUser.pass_word) {
  //   const token = jwt.sign({ _id: foundUser.id }, SECRET);
  //   return res.status(200).json({ token, foundUser });
  // } else {
  //   return res.status(422).json({ error: "Invalid username of password" });
  // }

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

router.post("/api/signup", (req, res) => {
  console.log(req.body);
  const { user_name, pass_word } = req.body;
  if (!user_name || !pass_word) {
    return res.status(422).json({ error: "please add all field" });
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
            res.json({ message: "saved successfull" });
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

router.get("/api/getusers", async (req, res) => {
  const userList = await User.find().select("-pass_word");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/api/getuser/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-pass_word");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

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

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.delete("/api/user/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
