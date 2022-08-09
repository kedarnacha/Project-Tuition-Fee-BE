const express = require("express")
const app = express()
const pembayaran = require("../models/index").pembayaran
const spp = require("../models/index").spp
const siswa = require("../models/index").siswa

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { auth_verify, accessLimit } = require("./auth")
app.use(auth_verify)
// get data
app.get("/", async (req, res) => {
    pembayaran.findAll({ include: [{ all: true, nested: true }] })
        .then(result => {
            res.json({
                pembayaran: result,
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
app.post("/",accessLimit(["admin", "petugas"]), async (req, res) => {
    // put data
    let data = {
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        tanggal_bayar: req.body.tanggal_bayar,
        bulan_bayar: req.body.bulan_bayar,
        tahun_bayar: req.body.tahun_bayar,
        jumlah_bayar: req.body.jumlah_bayar
    }
    let awal = await siswa.findOne({ where: { nisn: data.nisn } })

    pembayaran.create(data)
        .then(result => {
            siswa.update({ tunggakan: (awal.tunggakan - data.jumlah_bayar) }, { where: { nisn: data.nisn } })
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
app.put("/",accessLimit(["admin", "petugas"]), async (req, res) => {
    // put data
    let data = {
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        tanggal_bayar: req.body.tanggal_bayar,
        bulan_bayar: req.body.bulan_bayar,
        tahun_bayar: req.body.tahun_bayar,
        jumlah_bayar: req.body.jumlah_bayar
    }

    let param = {
        id_pembayaran: req.body.id_pembayaran
    }

    pembayaran.update(data, { where: param })
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
app.delete("/:id_pembayaran",accessLimit(["admin", "petugas"]), async (req, res) => {
    // put data
    let param = {
        id_pembayaran: req.params.id_pembayaran
    }

    pembayaran.destroy({ where: param })
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