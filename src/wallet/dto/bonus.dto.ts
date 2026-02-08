import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class BonusDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  assetTypeId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
