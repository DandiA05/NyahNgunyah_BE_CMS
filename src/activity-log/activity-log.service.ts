import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly mainRepository: Repository<ActivityLog>,
  ) {}

  async create(payload: CreateActivityLogDto) {
    console.log(payload);
  }
}
