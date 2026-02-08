import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://user1:password1@localhost:5432/wallet_db',
  entities: ['src/entities/*.entity.ts'],
  migrations: [],
  synchronize: true,
});
