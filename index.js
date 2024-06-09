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

// const realsticBg = 'wolverinn/realistic-background:ce02013b285241316db1554f28b583ef5aaaf4ac4f118dc08c460e634b2e3e6b'

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

// app.post("/generate-image", async (req, res) => {
//   try {
//     const { image, propmt } = req.body;
//     const result = await replicate.run(model, { input: { image } });
//     const input2 = {
//       image_path: result,
//       // image,
//       prompt: propmt,
//       negative_prompt:
//         "text, watermark, painting, cartoons, sketch, worst quality, blurry, dark, cluttered, low-resolution, inappropriate fonts, irrelevant elements",
//       // negative_prompt:
//       //   "deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
//       image_num: 4,
//       guidance_scale: 7.5,
//       num_inference_steps: 20,
//       manual_seed: -1,
//     };
//     const addBG = await replicate.run(model1, { input: { ...input2 } });

//     res.status(200).json({ output: addBG });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Function to generate a dynamic prompt based on user input

const keywordMapping = {
  sea: ["sea", "ocean", "waves"],
  beach: ["beach", "ocean", "sand"],
  sunset: ["sunset", "evening", "dusk"],
  sunrise: ["sunrise", "morning", "dawn"],
  sale: ["sale", "discount", "offer"],
  advertisement: ["advertisement", "ad", "promo"],
  product: ["product", "item", "goods"],
  enhance: ["enhance", "improve", "upgrade"],
  promotional: ["promotional", "marketing", "ad"],
  discount: ["discount", "sale", "offer"],
  "high-resolution": ["high-resolution", "HD", "clear"],
  professional: ["professional", "expert", "high-quality"],
  lifestyle: ["lifestyle", "everyday", "life"],
  versatile: ["versatile", "multi-purpose", "adaptable"],
  innovative: ["innovative", "new", "creative"],
  sleek: ["sleek", "smooth", "stylish"],
  customizable: ["customizable", "tailored", "personalized"],
  "limited-edition": ["limited-edition", "exclusive", "rare"],
  "award-winning": ["award-winning", "recognized", "honored"],
  sustainable: ["sustainable", "eco-friendly", "green"],
  elegant: ["elegant", "graceful", "stylish"],
  "natural beauty": ["natural beauty", "scenic", "picturesque"],
  colorful: ["colorful", "vibrant", "bright"],
  captivating: ["captivating", "mesmerizing", "enchanting"],
  luxurious: ["luxurious", "opulent", "grand"],
  minimalist: ["minimalist", "simple", "clean"],
  organic: ["organic", "natural", "pure"],
  premium: ["premium", "high-end", "exclusive"],
  urban: ["urban", "city", "metropolitan"],
  rustic: ["rustic", "country", "vintage"],
  authentic: ["authentic", "genuine", "real"],
  exclusive: ["exclusive", "limited", "unique"],
  trendy: ["trendy", "fashionable", "stylish"],
  vintage: ["vintage", "classic", "retro"],
  dynamic: ["dynamic", "energetic", "active"],
  "eye-catching": ["eye-catching", "striking", "noticeable"],
  festive: ["festive", "celebratory", "joyful"],
  glamorous: ["glamorous", "chic", "elegant"],
  inspiring: ["inspiring", "motivational", "uplifting"],
  timeless: ["timeless", "classic", "everlasting"],
  wholesome: ["wholesome", "healthy", "nutritious"],
  artisanal: ["artisanal", "craft", "handmade"],
  "cutting-edge": ["cutting-edge", "advanced", "innovative"],
  sophisticated: ["sophisticated", "refined", "elegant"],
  sleek: ["sleek", "smooth", "stylish"],
  versatile: ["versatile", "adaptable", "multi-purpose"],
  "user-friendly": ["user-friendly", "easy-to-use", "intuitive"],
  convenient: ["convenient", "handy", "accessible"],
  "all-natural": ["all-natural", "organic", "pure"],
  handcrafted: ["handcrafted", "artisan", "handmade"],
  deluxe: ["deluxe", "luxury", "premium"],
  innovative: ["innovative", "creative", "new"],
  stunning: ["stunning", "beautiful", "gorgeous"],
  crisp: ["crisp", "clear", "sharp"],
  serene: ["serene", "calm", "peaceful"],
  vibrant: ["vibrant", "colorful", "bright"],
};

const generateDynamicPrompt = (prompt) => {
  const words = prompt.split(" ");
  const matchedKeywords = new Set();

  words.forEach((word) => {
    if (keywordMapping[word]) {
      keywordMapping[word].forEach((kw) => matchedKeywords.add(kw));
    }
  });

  const keywordsString = Array.from(matchedKeywords).join(", ");
  return `Create a 4k image featuring a ${prompt}. Ensure the scene is elegant and visually appealing. Keywords: ${keywordsString}.`;
};

app.post("/generate-image", async (req, res) => {
  try {
    const { image, propmt } = req.body;

    // Generate the prompt dynamically
    const dynamicPrompt = generateDynamicPrompt(propmt);

    const result = await replicate.run(model, { input: { image } });

    const input2 = {
      image_path: result,
      prompt: dynamicPrompt,
      negative_prompt:
        "text, watermark, painting, cartoons, sketch, worst quality, blurry, dark, cluttered, low-resolution, inappropriate fonts, irrelevant elements",
      image_num: 4,
      guidance_scale: 7.5,
      num_inference_steps: 20,
      manual_seed: -1,
    };

    const addBG = await replicate.run(model1, { input: { ...input2 } });

    res.status(200).json({ output: addBG});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
