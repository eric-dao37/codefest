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

/**
 * Endpoint to create image from caption 
*/
app.post("/create_image", async (req, res) => {
    const { caption } = req.body;
    try {
        const response = await openai.createImage({
            prompt: caption,
            n: 1,
            size: "1024x1024",
        });
        return res.status(200).json({
            success: true,
            url: response.data.data[0].url,
        });
    } catch (err) {
        res.send(err.message);
        console.log(err.message);
    }
});

/**
 * End point to create caption
 */
app.post("/create_caption", async (req, res) => {
    const { prompt } = req.body;
    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
        });

        const completion = response.data.choices[0].text;

        return res.status(200).json({
            success: true,
            caption: completion,
        });
    } catch (err) {
        res.send(err.message);
        console.log(err.message);

    }
});

/**
 * End point to create caption and image
 */
app.post("/create_all", async (req, res) => {
    const { prompt } = req.body;
    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }

        const responseCaption = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
        });

        console.log(responseCaption.data)

        const completion = responseCaption.data.choices[0].text;

        const responseImage = await openai.createImage({
            prompt: completion,
            n: 1,
            size: "1024x1024",
        });
        return res.status(200).json({
            success: true,
            url: responseImage.data.data[0].url,
            caption: completion,
        });
    } catch (err) {
        res.send(err.message);
        console.log(err.message);
    }
});

app.get("/", async (req, res) => {

    res.send("Hello Code fest");

});