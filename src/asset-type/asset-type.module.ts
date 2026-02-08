import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetType } from '../entities';
import { AssetTypeController } from './asset-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetType])],
  controllers: [AssetTypeController],
})
export class AssetTypeModule {}
