const express = require("express")
const app = express()
const siswa = require("../models/index").siswa
const spp = require("../models/index").spp
const kelas = require("../models/index").kelas

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const jwt = require("jsonwebtoken")
const SECRET_KEY = "siswa"

app.post("/auth", async (req, res) => {
    let params = {
        nisn: req.body.nisn
    }

    let result = await siswa.findOne({ where: params })
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

app.get("/",accessLimit(["admin","petugas"]), async (req, res) => {
    siswa.findAll({ include: [{ all: true, nested: true }] })
        .then(result => {
            res.json({
                siswa: result,
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
        nisn: req.body.nisn,
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp
    }
    let getSpp = async (id_kelas) => {
        let angk = await kelas.findOne({ where: { id_kelas: id_kelas } })
        angkatan = angk.angkatan

        let nom = await spp.findOne({ where: { angkatan: angkatan } })
        return nom.nominal
    }
    var now = new Date();
    const oneJuly2021 = 1625072400000;
    const referenceDay = Math.floor(oneJuly2021 / 8.64e7)
    const today = Math.floor(now / 8.64e7)

    const differenceMonth = Math.floor((today - referenceDay) / 30)
    const biayaSPP = await getSpp(data.id_kelas)
    const tunggakan = differenceMonth * biayaSPP
    data.tunggakan = tunggakan

    siswa.create(data)
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
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp
    }

    let param = {
        nisn: req.body.nisn
    }

    siswa.update(data, { where: param })
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
app.delete("/:nisn", accessLimit(["admin"]), async (req, res) => {
    // put data
    let param = {
        nisn: req.params.nisn
    }

    siswa.destroy({ where: param })
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