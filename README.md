<div align="center">
  <a href="https://nextjs.org">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/95b669a7-0b25-4380-8b6d-d4c1411e88cc">
      <img alt="Erremor logo" src="https://github.com/user-attachments/assets/95b669a7-0b25-4380-8b6d-d4c1411e88cc" height="128">
    </picture>
  </a>
  <h1>Erremore Task Manager</h1>
</div>

![Last Commit](https://img.shields.io/github/last-commit/AshedFox/erremor-task-manager?logo=github&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Description

Built with Next.js and NestJS. This application combines scalable architecture, secure auth, comfortable UX/UI, and good performance.

Erremor implements full task management cycle - from user registration to projects and tasks management. It supports collaboration in shared projects, multiple task views (kanban and list), advanced task content and many-many other. This task manager focuses on stability, UX/UI, and security: authentication via JWT tokens with refresh tokens stored in Redis, email verification, HTTP-only cookies, data validation.

The client side uses server components, streaming, virtualization, optimized data fetching, making sure that there is good responsiveness as well as seamless user expirience. Thanks to application modular architecture and monorepo setup, Erremore is easy to extend and integrate with external systems.

## Tech Stack

| Layer         | Key technologies                                                       |
|---------------|------------------------------------------------------------------------|
| Frontend      | Next.js 15, React 19, TypeScript, tanstack-query, zod, react-hook-form |
| UI            | shadcn/ui, TailwindCSS                                                 |
| Backend       | NestJS, Prisma, PostgreSQL, Redis, BullMQ, nodemailer                  |
| Auth          | JWT, Argon2, Redis                                                     |
| Storage       | S3-compatible (MinIO)                                                  |


## Project Structure

```bash
apps/
  web/                  # Next.js frontend
  api/                  # NestJS backend
packages/
  ui/                   # Shared UI components
  eslint-config/        # Shared eslint configs
  typescript-confing    # Shared typescript configs
```

## Features

- User registration with email verification.
- User login with JWT tokens (access and refresh tokens (in Redis)), background tokens refresh when access token expired.
- Secure password hashing (argon2), http-only cookies, auth guard.
- Password reset with token or old password (only api for now).
- User profiles with avatar, birth date and display name change.
- Username generation with predefined set of nouns, adjectives and random string.
- Projects with basic CRUD operations and search (with sort, filters and includes) for them.
- Recent projects tracking (based on when last viewed by user).
- Shared projects with different users participation (support different participant roles with different rights and roles checks).
- Participants management: invite (email or in-app), kick, ban, leave.
- Files upload with presigned urls to s3-compatible storage, different file types, unused files cleanup.
- Tasks with different priorities, statuses, tags and other information. Basic CRUD operations and search (filters, sort, includes) for them.
- Two tasks view modes: kanban (grouped by task status, with drag-and-drop support) and list, has pagination and infinite scroll.
- Task attachments of different types with special UI for each.
- User-friendly forms and requests validation and success and error messages (with toast notifications).
- Performance optimizations with server components, virtual lists, debounce.
- Better UX with initial data prefetching (e.g. first page of tasks), streaming and smooth UI updates.
- Support different color modes (light, dark and system).

## TODO

- [ ] Password reset (client-side).
- [ ] Notification system (in-app, email).
- [ ] User preferences to configure future notifications, possible invitations and so on.
- [ ] Checklist in tasks.
- [ ] Assign task to participant.
- [ ] Relations between tasks (e.g. "Task A" depends on "Task B" or vice versa).
- [ ] Tasks calendar.
- [ ] Analytics.

## Usage

- Install dependencies:

```bash
pnpm install
```

- Run (dev):

```bash
pnpm run dev
```

- Build:

```bash
pnpm run build
```

- Lint:

```bash
pnpm run lint
```

## Gallery

#### Profile page

<img alt="profile" src="https://github.com/user-attachments/assets/13359e6c-25b9-4700-aaaf-21fb88f0a9e4" />

#### Projects page

<img alt="projects" src="https://github.com/user-attachments/assets/02fe5fe7-6859-46c4-a8ca-577950905510" />

#### Create project dialog

<img alt="projects_create" src="https://github.com/user-attachments/assets/c0ab9509-655e-4dfc-9459-7421de7d8225" />

#### Project page (kanban view mode)

<img alt="project_viewMode_kanban" src="https://github.com/user-attachments/assets/bc274dd4-6ba9-4e4f-9be8-26db736837b4" />

#### Project page (list view mode)

<img alt="project_viewMode_list" src="https://github.com/user-attachments/assets/b51dac2c-fa7b-406c-9146-1312c7a53245" />

#### Task page

<img alt="project_task" src="https://github.com/user-attachments/assets/a2153426-8591-42a1-aabe-70163888476b" />

#### Task dialog

<img alt="project_task_dialog"  src="https://github.com/user-attachments/assets/7ea14154-9964-4a74-a932-d6d12bf341f5" />

#### Task edit page

<img alt="project_task_edit" src="https://github.com/user-attachments/assets/87bef960-0eb0-4318-b71f-f00a7073d643" />

#### Task edit dialog

<img alt="project_task_edit_dialog" src="https://github.com/user-attachments/assets/70fe9d4c-3320-430e-9147-9292ebbd4e81" />
