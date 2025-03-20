// services/JWTService.js
const jwt = require("jsonwebtoken");
// const User = require("../entity/User");
// const { CustomException } = require("../exceptions/CustomException"); // Uncomment if you have a CustomException class
const JWT_KEY = process.env.JWT_SECRET || "your-secret-key";

const  User  = require('../schemas/UserSchema');

class JWTService {
    static extractUsername(token) {
        const decoded = JWTService.decodeToken(token);
        if (!decoded.status) throw new Error("Invalid token");
        return decoded.decode.id;
    }


    static decodeJWT = async (token) => {
        try {
            const decoded = await JWTService.decodeToken(token);

            const user = await User.findOne({ _id: decoded.decode.id }).populate({
                path: 'role',
                select: 'name'
            });
            if (!user) throw new Error("User not found");

            console.log("User:", user);
            return {
                userId: user._id,
                name: user.name,
                roles: user.roles.name,
            };
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    };

    static async generateToken(userDetails) {


        try{
            const user = await User.findOne({ email: userDetails.userEmail }).populate({
                path: 'role',
                select: 'name'
            });
            if (!user){

                return { status: 404, message: 'User not found' };
            }
            const payload = {
                id: user._id,
                role:user.role.name,
                sub: user.email,
                name: user.name,
            };

            const accessToken = jwt.sign(payload, JWT_KEY, { expiresIn: "30m" });
            const refreshToken = jwt.sign(payload, JWT_KEY, { expiresIn: "30d" });

            return {
                userId: user._id,
                name: user.name,
                role: user.role.name,
                accessToken,
                refreshToken
            };

        }catch (error){
            throw error
        }
    }

    static async isTokenValid(token) {
        const decoded = await JWTService.decodeToken(token);
        if (!decoded.status) return false;

        const user = await User.findOne({ _id: decoded.decode.id }).populate({
            path: 'role',
            select: 'name'
        });
        if (!user) return false; // User not found

        try{
            jwt.verify(token, JWT_KEY);
        }catch (error){
            return false;
        }
        return user;
    }

    static async getUserFromToken(token) {
        const id = JWTService.extractUsername(token);
        const user = await User.findOne({ _id: id }).populate({
            path: 'role',
            select: 'name'
        });
        if (!user) throw new Error("User not found");
        return user;
    }

    static extractClaim(token, claim) {
        const decoded = JWTService.decodeToken(token);
        if (!decoded.status) throw new Error("Invalid token");
        return decoded.decode[claim];
    }

    static async isTokenExpired(token) {
        try{
            const decodedToken = await JWTService.decodeToken(token);
            return decodedToken.decode.exp < Math.floor(Date.now() / 1000);
        }catch (error){
            return true;
        }
    }

    static decodeToken(token) {
        try {
            const decode = jwt.decode(token, JWT_KEY);
            return { decode, status: true };
        } catch (error) {
            return { status: false };
        }
    }

}

module.exports = JWTService;
