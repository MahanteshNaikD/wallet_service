import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntry, LedgerEntryType, SystemAccount, Wallet } from '../entities';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(SystemAccount)
    private systemAccountRepo: Repository<SystemAccount>,
  ) {}

  async getBalance(userId: string, assetTypeId: string): Promise<string> {
    const wallet = await this.walletRepo.findOne({
      where: { userId, assetTypeId },
    });
    return wallet ? String(wallet.balance) : '0';
  }

  async getOrCreateUserWallet(
    userId: string,
    assetTypeId: string,
  ): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({
      where: { userId, assetTypeId },
    });
    if (!wallet) {
      wallet = this.walletRepo.create({
        userId,
        assetTypeId,
        balance: '0',
      });
      await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getSystemWallet(
    accountName: string,
    assetTypeId: string,
  ): Promise<Wallet | null> {
    const sa = await this.systemAccountRepo.findOne({
      where: { name: accountName, assetTypeId },
      relations: ['wallet'],
    });
    return sa?.wallet ?? null;
  }

  async createLedgerEntry(
    walletId: string,
    amount: string,
    type: LedgerEntryType,
    refId?: string,
    idempotencyKey?: string,
  ): Promise<LedgerEntry> {
    const entry = this.walletRepo.manager.create(LedgerEntry, {
      walletId,
      amount,
      type,
      refId,
      idempotencyKey,
    });
    return this.walletRepo.manager.save(entry);
  }
}
