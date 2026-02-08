import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AssetType } from '../entities/asset-type.entity';
import { Wallet } from '../entities/wallet.entity';
import { SystemAccount } from '../entities/system-account.entity';
import { LedgerEntry } from '../entities/ledger-entry.entity';
import { IdempotencyKey } from '../entities/idempotency-key.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://user1:password1@localhost:5432/wallet_db',
  entities: [AssetType, Wallet, SystemAccount, LedgerEntry, IdempotencyKey],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const assetTypeRepo = dataSource.getRepository(AssetType);
  const walletRepo = dataSource.getRepository(Wallet);
  const systemAccountRepo = dataSource.getRepository(SystemAccount);

  const gold = assetTypeRepo.create({ name: 'Gold Coins', symbol: 'GOLD' });
  const diamonds = assetTypeRepo.create({ name: 'Diamonds', symbol: 'DIAMOND' });
  const silver = assetTypeRepo.create({ name: 'Silver', symbol: 'SILVER' });

  await assetTypeRepo.save([gold, diamonds, silver]);

  const treasuryGold = walletRepo.create({
    userId: null,
    assetTypeId: gold.id,
    balance: '1000000',
  });
  await walletRepo.save(treasuryGold);

  const treasuryDiamonds = walletRepo.create({
    userId: null,
    assetTypeId: diamonds.id,
    balance: '500000',
  });
  await walletRepo.save(treasuryDiamonds);

  const revenueGold = walletRepo.create({
    userId: null,
    assetTypeId: gold.id,
    balance: '0',
  });
  await walletRepo.save(revenueGold);

  const revenueDiamonds = walletRepo.create({
    userId: null,
    assetTypeId: diamonds.id,
    balance: '0',
  });
  await walletRepo.save(revenueDiamonds);

  await systemAccountRepo.save([
    systemAccountRepo.create({
      name: 'Treasury',
      assetTypeId: gold.id,
      walletId: treasuryGold.id,
    }),
    systemAccountRepo.create({
      name: 'Treasury',
      assetTypeId: diamonds.id,
      walletId: treasuryDiamonds.id,
    }),
    systemAccountRepo.create({
      name: 'Revenue',
      assetTypeId: gold.id,
      walletId: revenueGold.id,
    }),
    systemAccountRepo.create({
      name: 'Revenue',
      assetTypeId: diamonds.id,
      walletId: revenueDiamonds.id,
    }),
  ]);

  const user1Gold = walletRepo.create({
    userId: 'user-1',
    assetTypeId: gold.id,
    balance: '100',
  });
  await walletRepo.save(user1Gold);

  const user2Gold = walletRepo.create({
    userId: 'user-2',
    assetTypeId: gold.id,
    balance: '50',
  });
  await walletRepo.save(user2Gold);

  const user1Diamonds = walletRepo.create({
    userId: 'user-1',
    assetTypeId: diamonds.id,
    balance: '20',
  });
  await walletRepo.save(user1Diamonds);

  console.log('Seed completed');
  console.log('Asset types:', { gold: gold.id, diamonds: diamonds.id });
  console.log('Test users: user-1, user-2');
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
