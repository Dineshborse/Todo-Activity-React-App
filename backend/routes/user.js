const express = require("express");
const router = express.Router();
const userInfo = require("../modals/user-modal");
const todoInfo = require("../modals/todo-modal");


router.post("/login", (req, res) => {
    //res.status(200).send("Login works")
    userInfo.find({ username: req.body.username }).then((userData) => {
        if (userData.length) {
            bcrypt.compare(req.body.password, userData[0].password).then((val) => {
                if (val) {
                    const authToken = jwt.sign(userData[0].username, process.env.SECRET_KEY)
                    console.log(authToken);
                    res.status(200).send({ "status": "success", "token": authToken })
                } else {
                    res.status(400).send({ "status": "access denied", "message": "wrong password" })
                }
            })
        } else {
            res.status(400).send({ "status": "Invalid user", "message": "User not found" })
        }
    })
})


router.post("/register", async (req, res) => {
    // res.status(200).send("signup works")
    if (await checkExistingUser(req.body.username)) {
        res.status(400).send({ "status": "Invalid user", "message": 'Username exists please try with different one' })
    } else {
        if (req.body.password === req.body.cpassword) {
            bcrypt.genSalt(salt).then((saltHash) => {
                bcrypt.hash(req.body.password, saltHash).then((passwordHash) => {
                    userInfo.create({ username: req.body.username, password: passwordHash })
                        .then(() => {
                            todoInfo.create({ username: req.body.username, todoList: [] })
                        })
                        .then(() => {
                            res.status(200).send({ "status": "success", "message": "Registerd successfully" })
                        }).catch((err) => {
                            res.status(400).send({ "status": "Failed", "message": "Database Error" })
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })

        } else {
            return res.status(400).send({ "status": "Failed", "message": "Password mismatch" })
        }
    }
})


router.post("/logout", (req, res) => {
    res.status(200).send({ "status": "success", "message": "Loggedout successfully" })
})

module.exports = router;