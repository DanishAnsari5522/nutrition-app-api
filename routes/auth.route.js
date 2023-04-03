const express = require("express")
const route = express.Router()
const { login, signup,addmeal,getAllMeal,getMeal } = require("../controllers/auth.controller")

route.post("/login", login)
route.post("/signup", signup)
route.post("/meal", addmeal)
route.get("/getallmeal", getAllMeal)
route.route('/getmeal/:id').get(getMeal)



module.exports = route