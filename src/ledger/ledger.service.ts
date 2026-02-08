import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  LedgerEntry,
  LedgerEntryType,
  Wallet,
} from '../entities';

@Injectable()
export class LedgerService {
  constructor(private dataSource: DataSource) {}

  async transfer(
    fromWalletId: string,
    toWalletId: string,
    amount: string,
    idempotencyKey?: string,
  ): Promise<{ debitEntryId: string; creditEntryId: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromWalletEntity = await queryRunner.manager.findOne(Wallet, {
        where: { id: fromWalletId },
        lock: { mode: 'pessimistic_write' },
      });

      const toWalletEntity = await queryRunner.manager.findOne(Wallet, {
        where: { id: toWalletId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromWalletEntity || !toWalletEntity) {
        throw new Error('Wallet not found');
      }

      const fromBalance = parseFloat(String(fromWalletEntity.balance));
      const amountNum = parseFloat(amount);
      if (fromBalance < amountNum) {
        throw new Error('Insufficient balance');
      }

      const debitEntry = queryRunner.manager.create(LedgerEntry, {
        walletId: fromWalletId,
        amount,
        type: LedgerEntryType.DEBIT,
        refId: toWalletId,
        idempotencyKey,
      });
      await queryRunner.manager.save(debitEntry);

      const creditEntry = queryRunner.manager.create(LedgerEntry, {
        walletId: toWalletId,
        amount,
        type: LedgerEntryType.CREDIT,
        refId: fromWalletId,
        idempotencyKey,
      });
      await queryRunner.manager.save(creditEntry);

      const newFromBalance = (fromBalance - amountNum).toFixed(4);
      const toBalance = parseFloat(String(toWalletEntity.balance));
      const newToBalance = (toBalance + amountNum).toFixed(4);

      await queryRunner.manager.update(Wallet, fromWalletId, {
        balance: newFromBalance,
      });
      await queryRunner.manager.update(Wallet, toWalletId, {
        balance: newToBalance,
      });

      await queryRunner.commitTransaction();
      return { debitEntryId: debitEntry.id, creditEntryId: creditEntry.id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
