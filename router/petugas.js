const express = require("express")
const app = express()
var md5 = require('md5');
const petugas = require("../models/index").petugas

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const jwt = require("jsonwebtoken")
const SECRET_KEY = "admins"




app.post("/auth", async (req, res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password),
        level: req.body.level
    }
    let result = await petugas.findOne({ where: params })
    if (result) {
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } else {
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})

const { auth_verify, accessLimit } = require("./auth")
app.use(auth_verify)

app.get("/",accessLimit(["admin", "petugas"]), async (req, res) => {
    petugas.findAll({ include: [{ all: true, nested: true }] })
        .then(result => {
            res.json({
                petugas: result,
                found: true
            })
        })
        .catch(error => {
            res.json({
                message: error.message,
                found: false
            })
        })
})

// add data
app.post("/",accessLimit(["admin"]), async (req, res) => {
    // put data
    let data = {
        username: req.body.username,
        nama_petugas: req.body.nama_petugas,
        level: req.body.level
    }

    if (req.body.password) {
        data.password = md5(req.body.password)
    }

    petugas.create(data)
        .then(result => {
            res.json({
                message: "Data inserted",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// update data
app.put("/",accessLimit(["admin"]), async (req, res) => {
    // put data
    let data = {
        username: req.body.username,
        nama_petugas: req.body.nama_petugas,
        level: req.body.level
    }

    let param = {
        id_petugas: req.body.id_petugas
    }

    if (req.body.password) {
        data.password = md5(req.body.password)
    }

    petugas.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data updated",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// delete data
app.delete("/:id_petugas",accessLimit(["admin"]), async (req, res) => {
    // put data
    let param = {
        id_petugas: req.params.id_petugas
    }

    petugas.destroy({ where: param })
        .then(result => {
            res.json({
                message: "Data deleted",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app;