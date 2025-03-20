const { signUpUser, signInUser, gerCurrentUser, getAllUsers } = require('../services/authService');
const SignUpDTO = require('../dtos/SignUpDTO');
const SignInDTO = require('../dtos/SignInDTO');


async function signUp(req, res) {
    try {

        // Convert request body to DTO
        const dto = new SignUpDTO(
            req.body.email,
            req.body.password,
            req.body.name,
        );

        // Call service function
        const result  = await signUpUser(dto);

        res.cookie('refreshToken', result.token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        // Send response
        return res.status(201).json({
            user: result.user,
            token: result.token,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function signIn(req, res) {

    try {

        // Convert request body to DTO
        const dto = new SignInDTO(
            req.body.email,
            req.body.password,
        );

        // Call service function
        const result  = await signInUser(dto);

        // Set the refresh token as a cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        // Send response
        return res.status(200).json({
            user: result.user,
            token: result.token,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

async function currentUser(req, res) {

    try {

        console.log(req.headers)
        //get token
        const token = req.headers['authorization'];

        //split token from Bearer name
         let split = token.split(' ');
         console.log(split[0]);
         console.log(split[1]);

        const user = await gerCurrentUser(split[1])

        console.log(user)
        return res.status(200).json({user})

    }catch (error) {
        res.status(400).json({ error: error.message });
    }

}


async function allUsers(req, res) {
    try {

        const users = await getAllUsers();

        if (users.error){
            return res.status(400).json({ error: users.error });
        }
        return res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { signUp, signIn, currentUser, allUsers };
