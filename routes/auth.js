import { Router } from 'express';
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const router = Router();


// Register

router.post('/register', async (req, res) => {
    
    try {
        // Generate hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create New User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Save user and response
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            res.status(404).json("User Not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) {
            res.status(404).json("Wrong password");
        }

        res.status(200).json(user)

    } catch (err) {
        res.status(500).json(err);
    }
    

})

export default router;