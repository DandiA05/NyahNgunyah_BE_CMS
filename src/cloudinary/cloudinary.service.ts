import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  generateSignature(paramsToSign?: any) {
    if (paramsToSign && Object.keys(paramsToSign).length > 0) {
      const params = { ...paramsToSign };
      if (params.timestamp) {
        params.timestamp = Number(params.timestamp);
      }
      const signature = cloudinary.utils.api_sign_request(
        params,
        process.env.CLOUDINARY_API_SECRET!,
      );
      return { signature };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'your_signed_preset';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      upload_preset,
    };
  }

  async destroyAsset(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete asset from Cloudinary: ${error.message}`);
    }
  }

  async fetchAssets() {
    try {
      const result = await cloudinary.api.resources({
        max_results: 100,
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch assets from Cloudinary: ${error.message}`);
    }
  }
}
