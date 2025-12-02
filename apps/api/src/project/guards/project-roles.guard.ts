import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ParticipantRole, ParticipantStatus } from '@prisma/client';
import { Request } from 'express';

import { PrismaService } from '@/prisma/prisma.service';
import { ROLE_HIERARCHY } from '@/project-participant/constants/role';

import {
  PROJECT_ID_SOURCE_KEY,
  ProjectIdSourceVariant,
} from '../decorators/project-id-source.decorator';
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

    const projectIdSource =
      this.reflector.getAllAndOverride<ProjectIdSourceVariant>(
        PROJECT_ID_SOURCE_KEY,
        [context.getHandler(), context.getClass()]
      );

    const userId = request.user?.sub;
    let projectId: string | undefined;

    if (projectIdSource === 'params') {
      projectId = request.params?.projectId as string | undefined;
    } else if (projectIdSource === 'body') {
      projectId = request.body?.projectId as string | undefined;
    } else if (projectIdSource === 'query') {
      projectId = request.query?.projectId as string | undefined;
    } else {
      throw new ForbiddenException('Invalid project id source');
    }

    if (!userId || !projectId) {
      throw new ForbiddenException('Missing user or project context');
    }

    const participant = await this.prisma.projectParticipant.findUnique({
      where: {
        projectId_userId: { userId, projectId },
        status: ParticipantStatus.JOINED,
      },
    });

    if (!participant) {
      throw new ForbiddenException("You don't have access to this project");
    }

    const userLevel = ROLE_HIERARCHY[participant.role];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('Insufficient project role');
    }

    return true;
  }
}
