const express = require("express");
const app = express();
const port = 4000;

app.use(express.static("images"));

app.get("/", (req, res) =>
  res.send(`
    <h1>Hello World!</h1> 
   
`)
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
