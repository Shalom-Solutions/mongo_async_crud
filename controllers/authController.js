const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized.
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean)
        // create JWTs object (AccessToken)
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                     "roles": roles
                 },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );
        // create JWTs object ( RefreshToken )
        const refreshToken = jwt.sign(
            {
                "username": foundUser.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        //saving refresh token with current user
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        // const currentUser = { ...foundUser, refreshToken};
        // usersDB.setUsers([...otherUsers, currentUser])
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        res.cookie('jwt', refreshToken, { httpOnly: true,sameSite: 'None', maxAge: 24 * 60 * 60 * 1000}) //secure: true,
        res.json({ accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }
