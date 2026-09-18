# Converse

Converse is a responsive social feed built with Next.js, React, Clerk, Prisma, MongoDB, and Cloudinary.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the Clerk, MongoDB, and Cloudinary values.
2. Create a Cloudinary unsigned upload preset named `converse`, restricted to images and an appropriate upload folder.
3. Configure the Clerk webhook endpoint as `/api/webhooks/clerk` and subscribe to `user.created`, `user.updated`, and `user.deleted`.
4. Install and generate the Prisma client:

   ```bash
   npm ci
   npx prisma generate
   ```

5. Apply the Prisma schema indexes to MongoDB in a controlled environment:

   ```bash
   npx prisma db push
   ```

6. Start the application:

   ```bash
   npm run dev
   ```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

MongoDB transactions require a replica set. Atlas clusters support this by default.
