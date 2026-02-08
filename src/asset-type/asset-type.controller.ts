import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetType } from '../entities';

@Controller('asset-types')
export class AssetTypeController {
  constructor(
    @InjectRepository(AssetType)
    private assetTypeRepo: Repository<AssetType>,
  ) {}

  @Get()
  async list() {
    return this.assetTypeRepo.find({ order: { name: 'ASC' } });
  }
}
