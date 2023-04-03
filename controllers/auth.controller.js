const user = require("../models/user.model");
const meal = require("../models/meal.model");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const springedge = require('springedge');

const signup = async (req, res) => {
    try {
        let { name, email, phone, password } = req.body
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "name, email ,password are required" })
        }
        if (isNaN(phone)) {
            return res.status(400).json({ success: false, message: "invalid mobile number (NaN)" })
        }
        // if (password.length < 8) {
        //     return res.status(400).json({ success: false, message: "password must be greater than 7 digit" })
        // }
        if (phone.toString().length === 10) {
            const varify = await user.findOne({ phone })
            if (varify) {
                if (varify.accountCreated) {
                    return res.status(401).json({ success: false, message: "User already exists" })
                } else {
                    // update
                    password = bcrypt.hashSync(password, 10);
                    const data = await user.findByIdAndUpdate(varify._id, { name, email, phone, password }, { new: true })
                    return res.status(200).json({ success: true, message: data })
                }
            } else {
                // create
                password = bcrypt.hashSync(password, 10);
                const data = await user.create({ name, email, phone, password })
                return res.status(200).json({ success: true, message: data })
            }
        } else {
            return res.status(400).json({ success: false, message: "invalid mobile number" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const login = async (req, res) => {
    try {
        let { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: "mobile ,password are required" })
        }

        const data = await user.findOne({ phone, accountCreated: true })
        if (!data) {
            return res.status(500).json({ success: false, message: "user don't exist with this mobile number" })
        }
        if (!bcrypt.compareSync(password, data.password)) {
            return res.status(500).json({ success: false, message: "wrong password" })
        }
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, data: { id: data._id, phone: data.phone, name: data.name, dp: data.dp }, token })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}


const addmeal = async (req, res) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let current_time = year + "-" + month + "-" + date;
    try {
        let { posted_by, meals } = req.body
        if (!posted_by || !meal) {
            return res.status(400).json({ success: false, message: "posted_by and meal are required" })
        }

        if (meals) {
            const data = await meal.create({ posted_by, current_time, meals })
            return res.status(200).json({ success: true, message: data })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllMeal = async (req, res) => {
    try {
        const tasks = await meal.find({})
        res.send(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getMeal = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await meal.findOne({posted_by: taskID});
        if (!task) {
            return res.status(400).json({ success: false, message: "Incorrect id" })
        }
        res.send(task)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

module.exports = {
    signup,
    login,
    addmeal,
    getAllMeal,
    getMeal
}