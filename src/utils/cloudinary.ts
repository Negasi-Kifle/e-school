// Cloudinary module
import cloudinary from 'cloudinary'

// Configs
import configs from "../configs";

// Set up cloudinary configuration
cloudinary.v2.config({
  cloud_name: configs.cloudinary.cloud_name,
  api_key: configs.cloudinary.api_key,
  api_secret: configs.cloudinary.api_secret,
});

// Export
export default cloudinary;