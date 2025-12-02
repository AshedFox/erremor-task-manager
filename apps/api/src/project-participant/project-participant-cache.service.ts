import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ProjectParticipant } from '@prisma/client';
import { Redis } from 'ioredis';

@Injectable()
export class ProjectParticipantCacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getKey(projectId: string, userId: string) {
    return `project:${projectId}:participant:${userId}`;
  }

  async invalidate(projectId: string, userId: string): Promise<void> {
    await this.redis.del(this.getKey(projectId, userId));
  }

  async set(
    projectId: string,
    userId: string,
    participant: ProjectParticipant,
    ttl: number = 60
  ): Promise<void> {
    await this.redis.set(
      this.getKey(projectId, userId),
      JSON.stringify(participant),
      'EX',
      ttl
    );
  }

  async get(
    projectId: string,
    userId: string
  ): Promise<ProjectParticipant | null> {
    const participant = await this.redis.get(this.getKey(projectId, userId));

    return participant ? (JSON.parse(participant) as ProjectParticipant) : null;
  }
}
