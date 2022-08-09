const express = require("express")
const app = express()
const kelas = require("../models/index").kelas
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// auth_verify
const { auth_verify, accessLimit } = require("./auth")
app.use(auth_verify)

app.get("/", accessLimit(["admin", "petugas"]), async (req, res) => {
    kelas.findAll({ include: [{ all: true, nested: true }] })
        .then(result => {
            res.json({
                kelas: result,
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
        nama_kelas: req.body.nama_kelas,
        jurusan: req.body.jurusan,
        angkatan: req.body.angkatan
    }

    kelas.create(data)
        .then(result => {
            res.json({
                message: "Berhasil menambah data",
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
        nama_kelas: req.body.nama_kelas,
        jurusan: req.body.jurusan,
        angkatan: req.body.angkatan
    }

    let param = {
        id_kelas: req.body.id_kelas
    }

    kelas.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Berhasil memperbarui data",
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
app.delete("/:id_kelas",accessLimit(["admin"]), async (req, res) => {
    // put data
    let param = {
        id_kelas: req.params.id_kelas
    }

    kelas.destroy({ where: param })
        .then(result => {
            res.json({
                message: "Data telah dihapus",
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