import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateWebTokenAndSetCookie from '../utils/generateWebTokenAndSetCookie.js'

export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body

        if(password != confirmPassword) return res.status(400).json({ message: "Password doesn't match" })

        const user = await User.findOne({ email })
        if(user) return res.status(400).json({ message: "Email already exist" })

        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateWebTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
        
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        
        if(!user || !isPasswordCorrect) return res.status(400).json({ error: "Incorrect email and password" })

        generateWebTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.firstName + " " + user.lastName,
            email: user.email
        })

    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);   
        res.status(500).json({ error: "Internal Server Error" })
    }
}