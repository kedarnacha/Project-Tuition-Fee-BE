const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors()) 
app.use(express.static(__dirname))

// router
const petugas = require("./router/petugas")
const siswa = require("./router/siswa")
const kelas = require("./router/kelas")
const spp = require("./router/spp")
const pembayaran = require("./router/pembayaran")
const schedule = require("./handlers/scheduler")
schedule
app.use("/petugas", petugas)
app.use("/siswa", siswa)
app.use("/kelas", kelas)
app.use("/spp", spp)
app.use("/pembayaran", pembayaran)

app.listen(8000, () => {
    console.log("Server run on 8000")
})
