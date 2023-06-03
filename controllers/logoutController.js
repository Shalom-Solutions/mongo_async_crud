const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }

  // Is refreshToken in db?
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser =  await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  //Delete the refresh token in the database
  // const otherUsers = usersDB.users.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: "" };
  // usersDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB.users)
  // );

  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result)

  res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true }); //secure: true - only serves on https
  res.sendStatus(204);
};
module.exports = { handleLogout };
