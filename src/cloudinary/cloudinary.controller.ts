import { Controller, Get, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('cloudinary')
@UseGuards(AuthGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signature')
  getSignature() {
    return this.cloudinaryService.generateSignature();
  }

  @Delete('assets')
  async deleteAsset(@Body('publicId') publicId: string) {
    if (!publicId) {
      throw new Error('publicId is required');
    }
    return this.cloudinaryService.destroyAsset(publicId);
  }

  @Get('assets')
  async getAssets() {
    return this.cloudinaryService.fetchAssets();
  }
}
