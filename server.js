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
app.post("/create_images", async (req, res) => {
    const { caption } = req.body;
    try {
        const response = await openai.createImage({
            prompt: caption,
            n: 4,
            size: "1024x1024",
        });
        const urlList = response.data.data
                  .map(item => item.url)
        return res.status(200).json({
            success: true,
            url_list: urlList,
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
            max_tokens: 2048,
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
            max_tokens: 2048,
        });

        console.log(responseCaption.data)

        const completion = responseCaption.data.choices[0].text;

        const responseImage = await openai.createImage({
            prompt: completion,
            n: 4,
            size: "1024x1024",
        });
        
        const urlList = responseImage.data.data
                  .map(item => item.url)

        return res.status(200).json({
            success: true,
            url_list: urlList,
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