const User = require("../models/users");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const checkUserUniqueness = async (field, value) => {
  return { error, isUnique } = await User.findOne({[field]: value}).exec()
      .then(user => {
          let res = {};
          if (Boolean(user)) {
              res = { error: "This " + field + " is not available", isUnique: false };
          } else {
              res = { error: "", isUnique: true };
          }
          return res;
      })
      .catch(err => console.log(err))
}

const validate = async (req, res) => {
  const { field, value } = req.body;
  const { error, isUnique } = await checkUserUniqueness(field, value);

  if (isUnique) {
      res.json({ success: 'success' });
  } else {
      res.json({ error });
  }
}

const register = async (req, res) => {
  let signData = {
    username: req.body.username || '',
    email: req.body.email || '',
    password: req.body.password || '',
  };

  const newUser = new User({ ...signData});
  // Generate the Salt
  bcrypt.genSalt(10, (err, salt) => {
      if(err) return err;
      // Create the hashed password
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) return err;
          newUser.password = hash;
          // Save the User
          newUser.save()
            .then( result => {
              console.log("success")
              res.json({ success: true });
            })
            .catch(err => {
              console.log(err)
              res.json({ success: false, msg: "Server Error" });
            });
      });
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  let errorMsg = '';

  User.findOne({ email: email }, (err, user) => {
      if (err) throw err;
      if (Boolean(user)) {
          // Match Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) return err;
              if (isMatch) {
                  const token = jwt.sign({
                          id: user._id,
                          username: user.username
                      }, config.jwtSecret);
                  res.json({ token: token, success: true, user: user })
              } else {
                  res.json({ msg: 'Invalid Username or Password', success: false });
              }
          });
      } else {
          res.json({ msg: 'Invalid Username or Password', success: false });
      }
  });
}

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    } else {
      return res.json({ success: true });
    }
  });
}

module.exports = {
  register,
  login,
  logout
};