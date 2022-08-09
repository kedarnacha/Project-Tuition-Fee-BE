const express = require("express")
const app = express()
const spp = require("../models/index").spp

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { auth_verify, accessLimit } = require("./auth")
app.use(auth_verify)

app.get("/", accessLimit(["admin", "petugas"]), async(req,res) => {
    spp.findAll({include:[{ all: true, nested: true }]})
    .then(result => {
        res.json({
            spp: result,
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
app.post("/",accessLimit(["admin"]), async(req,res) => {
    // put data
    let data = {
        angkatan: req.body.angkatan,
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }

    spp.create(data)
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
app.put("/",accessLimit(["admin"]), async(req,res) => {
    // put data
    let data = {
        angkatan: req.body.angkatan,
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }

    let param = {
        id_spp: req.body.id_spp
    }
    
    spp.update(data, {where: param})
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
app.delete("/:id_spp",accessLimit(["admin"]), async(req,res) => {
    // put data
    let param = {
        id_spp: req.params.id_spp
    }

    spp.destroy({where: param})
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