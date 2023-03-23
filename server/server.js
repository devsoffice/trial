const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan("combined"));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));