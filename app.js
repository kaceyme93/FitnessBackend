require("dotenv").config()
const PORT = process.env["PORT"] ?? 3002
const express = require("express")
const app = express()
const { client }= require('./db/client')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())


// Setup your Middleware and API Router here
const morgan = require('morgan')
app.use(morgan('dev'))
app.get('/health', (req, res) => {
    res.status(200).send("Health is good.")
})
const apiRouter = require('./api')
app.use('/api', apiRouter)

app.get('/api', (req, res) => {
  console.log("A get request was made to /api");
  res.send({ message: "success" });
});

app.listen(PORT, () => {
  client.connect();
  console.log(`Listening on port ${PORT}`);
})
.on("error", () => {
  process.once("SIGUSR2", function () {
    process.kill(process.pid, "SIGUSR2");
  });
  process.on("SIGINT", function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, "SIGINT");
  });
});
module.exports = app;
