const User = require('../schemas/UserSchema');
const Role = require('../schemas/RoleSchema');

const bcrypt = require('bcrypt');


const JWTService = require("../services/JWTService");


async function signUpUser(dto) {
    try {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email: dto.email });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(dto.password, 10);

        // Find the role, default to 'USER' if not specified
        let role = await Role.findOne({ name: 'USER' });
        if (!role) {
            throw new Error('Default USER role not found. Please seed roles first.');
        }

        // Create a new user with the assigned role
        const newUser = new User({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: role._id, // Assign role ID
        });

        // Save the user to the database
        await newUser.save();

        const tokens = await JWTService.generateToken({userEmail: newUser.email});

        console.log(tokens);

        if (tokens) {

            return {
                user: {
                    id: tokens.userId,
                    name: tokens.name,
                    role: tokens.role.name
                },
                token: tokens.accessToken,
            }
        }
    } catch (error) {
        throw error; // Propagate the error back to the controller
    }
}

async function signInUser(dto){
    try {

        // Find the user by email
        const user = await User.findOne({ email: dto.email }).populate({
            path: 'role',
            select: 'name'
        });

        console.log(user)

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare the provided password with the stored password (hash)
        // const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        // if (!isPasswordValid) {
        //     throw new Error('Invalid email or password');
        // }

        // Generate the tokens
        const tokens = await JWTService.generateToken({ userEmail: user.email });

        console.log(user.role)
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            },
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };

    } catch (error) {
        throw error;
    }
}

async function gerCurrentUser(token){

    const user =  await JWTService.getUserFromToken(token);

    return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.name,

    }
}

async function getAllUsers(){
    try {

        const users = await User.find().populate({
            path: 'role',
            select: 'name'
        });

        if (users.length === 0) {
            return { error: 'No users found' };
        }

        return users.map(user => {
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            }
        });

    }catch (error){
        return error;
    }
}


module.exports = { signUpUser, signInUser, gerCurrentUser, getAllUsers };
