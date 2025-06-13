FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# Copy Prisma schema so that postinstall (prisma generate) can run successfully
COPY prisma ./prisma
RUN npm install

# Copy the rest of the source code
COPY . .

# Build and generate Prisma client (redundant safety)
RUN npx prisma generate
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["npm", "start"] 