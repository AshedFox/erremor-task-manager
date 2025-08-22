import { Injectable, OnModuleInit } from '@nestjs/common';
import slugify from '@sindresorhus/slugify';
import { randomBytes } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';

@Injectable()
export class UsernameGeneratorService implements OnModuleInit {
  private nouns: string[] = [];
  private adjectives: string[] = [];

  async onModuleInit() {
    const nounsPath = path.join(__dirname, '../assets/nouns.json');
    const adjectivesPath = path.join(__dirname, '../assets/adjectives.json');

    this.nouns = JSON.parse(await readFile(nounsPath, 'utf-8')) as string[];
    this.adjectives = JSON.parse(
      await readFile(adjectivesPath, 'utf-8')
    ) as string[];

    if (this.nouns.length === 0 || this.adjectives.length === 0) {
      throw new Error('No nouns or adjectives for username generator.');
    }
  }

  generateUsername(): string {
    const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
    const adjective =
      this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    const suffix = randomBytes(3).toString('hex');

    return slugify(`${adjective}-${noun}-${suffix}`);
  }
}
