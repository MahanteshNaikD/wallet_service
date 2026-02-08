import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyKey } from '../entities';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(IdempotencyKey)
    private idempotencyRepo: Repository<IdempotencyKey>,
  ) {}

  async get(key: string): Promise<Record<string, unknown> | null> {
    const row = await this.idempotencyRepo.findOne({ where: { key } });
    return row ? (row.response as Record<string, unknown>) : null;
  }

  async set(key: string, response: Record<string, unknown>): Promise<void> {
    await this.idempotencyRepo.upsert(
      { key, response: response as object },
      { conflictPaths: ['key'] },
    );
  }
}
