import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ParticipantRole } from '@prisma/client';
import { Request } from 'express';

import { PrismaService } from '@/prisma/prisma.service';

import { PROJECT_ROLE_KEY } from '../decorators/project-roles.decorator';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<ParticipantRole>(
      PROJECT_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRole) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { sub?: string } }>();

    const userId = request.user?.sub;
    const projectId = (request.params?.projectId ||
      request.body?.projectId ||
      request.query?.projectId) as string | undefined;

    if (!userId || !projectId) {
      throw new ForbiddenException('Missing user or project context');
    }

    const participant = await this.prisma.projectParticipant.findUnique({
      where: {
        projectId_userId: { userId, projectId },
      },
    });

    if (!participant) {
      throw new ForbiddenException("You don't have access to this project");
    }

    const roleHierarchy = {
      [ParticipantRole.OWNER]: 4,
      [ParticipantRole.ADMIN]: 3,
      [ParticipantRole.USER]: 2,
      [ParticipantRole.GUEST]: 1,
    };
    const userLevel = roleHierarchy[participant.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('Insufficient project role');
    }

    return true;
  }
}
