require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const { OPENAI_API_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.listen(8080, () => {
  console.log("server started");
});

app.post("/create_image", async (req, res) => {
    const { caption } = req.body;
    try {
      const response = await openai.createImage({
        prompt: caption,
        n: 1,
        size: "1024x1024",
      });
      res.send(response.data.data[0].url);
    } catch (err) {
      res.send(err.message);
      console.log(err.message);

    }
  });

app.get("/", async (req, res) => {

    res.send("Hello Code fest");

});