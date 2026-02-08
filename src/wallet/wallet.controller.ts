import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { WalletService } from './wallet.service';
import { TopUpDto } from './dto/top-up.dto';
import { BonusDto } from './dto/bonus.dto';
import { SpendDto } from './dto/spend.dto';
import { BalanceQueryDto } from './dto/balance-query.dto';

@Controller('wallets')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private ledgerService: LedgerService,
    private idempotencyService: IdempotencyService,
  ) {}

  @Post('top-up')
  async topUp(@Body() dto: TopUpDto) {
    const idempotencyKey = dto.idempotencyKey;
    if (idempotencyKey) {
      const cached = await this.idempotencyService.get(idempotencyKey);
      if (cached) return cached;
    }

    const treasury = await this.walletService.getSystemWallet(
      'Treasury',
      dto.assetTypeId,
    );
    if (!treasury) throw new BadRequestException('Treasury wallet not found');

    const userWallet = await this.walletService.getOrCreateUserWallet(
      dto.userId,
      dto.assetTypeId,
    );

    const amount = String(dto.amount);
    const result = await this.ledgerService.transfer(
      treasury.id,
      userWallet.id,
      amount,
      idempotencyKey,
    );

    const balance = await this.walletService.getBalance(
      dto.userId,
      dto.assetTypeId,
    );
    const response = { success: true, result, balance };

    if (idempotencyKey) {
      await this.idempotencyService.set(idempotencyKey, response);
    }
    return response;
  }

  @Post('bonus')
  async bonus(@Body() dto: BonusDto) {
    const idempotencyKey = dto.idempotencyKey;
    if (idempotencyKey) {
      const cached = await this.idempotencyService.get(idempotencyKey);
      if (cached) return cached;
    }

    const treasury = await this.walletService.getSystemWallet(
      'Treasury',
      dto.assetTypeId,
    );
    if (!treasury) throw new BadRequestException('Treasury wallet not found');

    const userWallet = await this.walletService.getOrCreateUserWallet(
      dto.userId,
      dto.assetTypeId,
    );

    const amount = String(dto.amount);
    const result = await this.ledgerService.transfer(
      treasury.id,
      userWallet.id,
      amount,
      idempotencyKey,
    );

    const balance = await this.walletService.getBalance(
      dto.userId,
      dto.assetTypeId,
    );
    const response = { success: true, result, balance };

    if (idempotencyKey) {
      await this.idempotencyService.set(idempotencyKey, response);
    }
    return response;
  }

  @Post('spend')
  async spend(@Body() dto: SpendDto) {
    const idempotencyKey = dto.idempotencyKey;
    if (idempotencyKey) {
      const cached = await this.idempotencyService.get(idempotencyKey);
      if (cached) return cached;
    }

    const revenue = await this.walletService.getSystemWallet(
      'Revenue',
      dto.assetTypeId,
    );
    if (!revenue) throw new BadRequestException('Revenue wallet not found');

    const userWallet = await this.walletService.getOrCreateUserWallet(
      dto.userId,
      dto.assetTypeId,
    );

    const amount = String(dto.amount);
    const result = await this.ledgerService.transfer(
      userWallet.id,
      revenue.id,
      amount,
      idempotencyKey,
    );

    const balance = await this.walletService.getBalance(
      dto.userId,
      dto.assetTypeId,
    );
    const response = { success: true, result, balance };

    if (idempotencyKey) {
      await this.idempotencyService.set(idempotencyKey, response);
    }
    return response;
  }

  @Get('balance')
  async getBalance(@Query() query: BalanceQueryDto) {
    const balance = await this.walletService.getBalance(
      query.userId,
      query.assetTypeId,
    );
    return { balance };
  }
}
