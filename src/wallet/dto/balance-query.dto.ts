import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BalanceQueryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  assetTypeId: string;
}
