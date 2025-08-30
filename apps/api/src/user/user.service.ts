import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import argon2 from 'argon2';

import { PasswordService } from '@/auth/password.service';
import { Include, mapInclude } from '@/common/include';
import { OffsetPagination } from '@/common/pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { UsernameGeneratorService } from '@/username-generator/username-generator.service';

import { CreateUserDto } from './dto/create-user.dto';
import { SearchUsersFilterDto } from './dto/search-users-filter.dto';
import { SearchUsersSortDto } from './dto/search-users-sort.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyUsersResult, SafeUser } from './types/user.types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly usernameGenerator: UsernameGeneratorService
  ) {}

  async create({ password, email }: CreateUserDto): Promise<SafeUser> {
    const passwordHash = await this.passwordService.hash(password);
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      attempt++;
      const username = this.usernameGenerator.generateUsername();

      try {
        return this.prisma.user.create({
          data: {
            email,
            passwordHash,
            username,
          },
        });
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          const target = error.meta?.target as string[] | undefined;

          if (target?.includes('email')) {
            throw new ConflictException('User with this email already exists!');
          }

          if (target?.includes('username')) {
            continue;
          }
        }

        throw error;
      }
    }

    throw new InternalServerErrorException('Failed to create user!');
  }

  async search(
    pagination: OffsetPagination,
    filter: SearchUsersFilterDto,
    sort: SearchUsersSortDto,
    { include }: Include<Prisma.UserInclude>
  ): Promise<FindManyUsersResult> {
    const prismaInclude = mapInclude(include);
    const { search, ...restFilter } = filter;
    const where = {
      username: search ? { contains: search, mode: 'insensitive' } : undefined,
      ...restFilter,
    } satisfies Prisma.UserWhereInput;

    return this.prisma.$transaction([
      this.prisma.user.findMany({
        ...pagination,
        where,
        orderBy: sort.sortBy ? { [sort.sortBy]: sort.sortOrder } : undefined,
        include: prismaInclude,
      }),
      this.prisma.user.count({ where }),
    ]);
  }

  async findOneById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with this id not found!`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with this username not found!`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with this email not found!`);
    }

    return user;
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { passwordHash: false },
    });

    if (!user) {
      throw new NotFoundException(`User with this email not found!`);
    }

    return user;
  }

  update(id: string, data: UpdateUserDto): Promise<SafeUser> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with this id not found!`);
    }

    if (!(await this.passwordService.verify(user.passwordHash, oldPassword))) {
      throw new BadRequestException(`Old password is incorrect!`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: await this.passwordService.hash(newPassword) },
    });
  }

  async activate(id: string) {
    return this.prisma.user.update({
      where: { id, status: 'PENDING' },
      data: { status: 'ACTIVE' },
    });
  }

  async setPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with this id not found!`);
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}
