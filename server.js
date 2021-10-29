const express = require('express')
const api = require("./routes/api")
const bodyparser = require("body-parser")
const path = require("path")
const cors = require("cors")

console.log(path.resolve(__dirname, "public"));

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use("/public", express.static(path.resolve(__dirname, "public")))

app.use("/api", api)

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"))
})

app.all("**", (req, res) => {
    res.send("404 Not Found!")
})

app.listen(3300, () => {
    console.log("Server started on PORT 3300");
})