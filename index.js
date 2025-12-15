import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/remove-bg", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image missing" });
    }

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

    // ❗ VERY IMPORTANT
    if (!response.ok) {
      const errorText = await response.text();
      console.error("remove.bg error:", errorText);
      return res.status(400).json({
        error: "Background removal failed",
        raw: errorText,
      });
    }

    const buffer = await response.arrayBuffer();

    if (!buffer || buffer.byteLength === 0) {
      return res.status(400).json({ error: "Empty image returned" });
    }

    const cleanedBase64 = Buffer.from(buffer).toString("base64");

    res.json({
      cleanedImageBase64: cleanedBase64,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
