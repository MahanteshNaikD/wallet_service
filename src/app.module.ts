import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { AssetTypeModule } from './asset-type/asset-type.module';
import {
  AssetType,
  Wallet,
  LedgerEntry,
  SystemAccount,
  IdempotencyKey,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        AssetType,
        Wallet,
        LedgerEntry,
        SystemAccount,
        IdempotencyKey,
      ],
      synchronize: true,
    }),
    WalletModule,
    AssetTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
