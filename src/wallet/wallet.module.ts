import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAccount, Wallet } from '../entities';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdempotencyModule } from '../idempotency/idempotency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, SystemAccount]),
    LedgerModule,
    IdempotencyModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
