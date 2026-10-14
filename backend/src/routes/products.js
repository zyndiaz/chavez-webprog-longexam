import express from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { storeProductImage } from "../utils/productImageStorage.js";

const router = express.Router();
router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.search) query.name = { $regex: req.query.search, $options: "i" };
    if (req.query.category) query.category = req.query.category;
    res.json(await Product.find(query).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});
router.get("/:id", async (req, res, next) => {
  try { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ message: "Product not found." }); res.json(product); } catch (error) { next(error); }
});
router.post("/", requireAuth, requireRole("admin"), upload.single("image"), async (req, res, next) => { try { if (req.file) req.body.image = await storeProductImage(req.file); res.status(201).json(await Product.create(req.body)); } catch (error) { next(error); } });
router.patch("/:id", requireAuth, requireRole("admin"), upload.single("image"), async (req, res, next) => {
  try { if (req.file) req.body.image = await storeProductImage(req.file); const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!product) return res.status(404).json({ message: "Product not found." }); res.json(product); } catch (error) { next(error); }
});
export default router;
