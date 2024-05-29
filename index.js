const express = require("express");
const Replicate = require("replicate");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const port = 5000;
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cozy-smakager-1ec4ba.netlify.app",
    ],
    credentials: true,
  })
);

// const model = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"
const model =
  "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1";
const model1 =
  "logerzhu/ad-inpaint:b1c17d148455c1fda435ababe9ab1e03bc0d917cc3cf4251916f22c45c83c7df";

const replicate = new Replicate({
  auth: process.env.REPLICATE_ID,
});

app.get("/", (req, res) => {
  res.send("YOU ARE ONLINE");
});

app.get("/hello", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "hello world",
  });
});

app.post("/generate-image", async (req, res) => {
  try {
    const { image, propmt } = req.body;
    const result = await replicate.run(model, { input: { image } });
    const input2 = {
      prompt: propmt,
      image_num: 4,
      image_path: result,
      guidance_scale : 7.5,
      num_inference_steps : 20,
      manual_seed : -1,
      negative_prompt:
        "text, watermark, painting, cartoons, sketch, worst quality, blurry, dark, cluttered, low-resolution, inappropriate fonts, irrelevant elements",
    };
    const addBG = await replicate.run(model1, { input: { ...input2 } });

    res.status(200).json({ output: addBG });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
