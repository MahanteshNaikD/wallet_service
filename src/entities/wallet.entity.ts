import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AssetType } from './asset-type.entity';
import { LedgerEntry } from './ledger-entry.entity';
import { SystemAccount } from './system-account.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId: string | null;

  @Column({ name: 'asset_type_id' })
  assetTypeId: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, default: 0 })
  balance: string;

  @ManyToOne(() => AssetType)
  @JoinColumn({ name: 'asset_type_id' })
  assetType: AssetType;

  @OneToMany(() => LedgerEntry, (e) => e.wallet)
  ledgerEntries: LedgerEntry[];

  @OneToMany(() => SystemAccount, (s) => s.wallet)
  systemAccounts: SystemAccount[];
}
