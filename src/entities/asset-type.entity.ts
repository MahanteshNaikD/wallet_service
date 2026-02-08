import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('asset_types')
export class AssetType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  symbol: string;

  @OneToMany(() => Wallet, (w) => w.assetType)
  wallets: Wallet[];
}
