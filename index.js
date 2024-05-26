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
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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
  const { image, propmt } = req.body;
  async () => {
    try {
      // const result = await replicate.run(model, { input: { image } }); // Pass input object to model
      // const input2 = {
      //   // pixel: "512 * 512",
      //   // scale: 3,
      //   prompt: propmt,
      //   // image_num: 2,
      //   image_path: result,
      //   // product_size: "0.5 * width",
      //   negative_prompt:
      //     "text, watermark, painting, cartoons, sketch,worst quality",
      // };

      // const addBG = await replicate.run(model1, { input: { ...input2 } }); // Combine both inputs

      res.status(200).json({ output: image });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
