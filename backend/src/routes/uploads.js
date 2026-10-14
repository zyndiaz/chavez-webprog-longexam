import express from "express";
import { findProductImage, streamProductImage } from "../utils/productImageStorage.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const file = await findProductImage(req.params.id);
    if (!file) return res.status(404).json({ message: "Image not found." });

    res.setHeader("Content-Type", file.metadata?.contentType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const stream = streamProductImage(file._id);
    stream.on("error", (error) => {
      if (res.headersSent) res.destroy(error);
      else next(error);
    });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;