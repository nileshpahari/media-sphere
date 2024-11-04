import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const extractPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split('.')[0];
  return publicId;
};

const cloudinaryUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })
    console.log("File uploaded successfully ", response.url);
    fs.unlink(localFilePath, (err) => {
      if (err) throw err;
    })
    console.log(`deleted ${localFilePath}`)
    return response;
  } catch (error) {
    console.log(error)
    fs.unlink(localFilePath, (err) => {
      if (err) throw err;
    })
    console.log(`deleted ${localFilePath}`)
    return null;
  }

}

const cloudinaryDelete = async (remoteFilePath) => {
  try {
    if (!remoteFilePath) return null;
    const publicId = extractPublicIdFromUrl(remoteFilePath)
    const response = await cloudinary.uploader.destroy(publicId)
    console.log(response)
  } catch (error) {
    console.log(error)
    return null
  }
}


export { cloudinaryUpload, cloudinaryDelete }
