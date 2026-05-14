# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim

# Install system deps required by Playwright/Chromium.
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install npm deps first (layer-cached as long as package.json doesn't change).
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Install Playwright's bundled Chromium.
RUN npx playwright install chromium

# Copy source and compile TypeScript.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PLAYWRIGHT_HEADLESS=true

CMD ["node", "dist/index.js"]
