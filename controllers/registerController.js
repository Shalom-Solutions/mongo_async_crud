// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");
//const fsPromises = require("fs").promises;
//const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "Invalid username or password" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user}).exec();

  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    //encrypt the password
    const hashedpwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const result = await User.create({
       "username": user, 
       "password": hashedpwd 
      });
  
      console.log(result);
   
    res.status(201).json({ success: `New user ${user} created` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
