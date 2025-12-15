import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/remove-bg", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        size: "auto",
      }),
    });

    const buffer = await response.arrayBuffer();
    const cleanedBase64 = Buffer.from(buffer).toString("base64");

    res.json({ cleanedImageBase64: cleanedBase64 });
  } catch (e) {
    res.status(500).json({ error: "Background removal failed" });
  }
});

app.listen(3000, () => console.log("Server running"));
