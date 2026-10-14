import mongoose from "mongoose";

const { GridFSBucket, ObjectId } = mongoose.mongo;

const getBucket = () => {
  const database = mongoose.connection.db;
  if (!database) throw new Error("Database connection is unavailable.");
  return new GridFSBucket(database, { bucketName: "productImages" });
};

export function storeProductImage(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(file.originalname, {
      metadata: { contentType: file.mimetype },
    });
    uploadStream.once("error", reject);
    uploadStream.once("finish", () => resolve(`/api/uploads/${uploadStream.id.toString()}`));
    uploadStream.end(file.buffer);
  });
}

export function findProductImage(id) {
  if (!ObjectId.isValid(id)) return null;
  return getBucket().find({ _id: new ObjectId(id) }).next();
}

export function streamProductImage(id) {
  return getBucket().openDownloadStream(id);
}