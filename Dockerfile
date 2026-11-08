# ========================================================
# STAGE 1: Backend Dependencies (Composer)
# ========================================================
FROM composer:2 AS vendor

WORKDIR /app

# Mencegah limit memori & non-interactive hang
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1 \
    COMPOSER_NO_INTERACTION=1

COPY composer.json composer.lock ./

# Mount secret composer_auth jika disediakan (misal dari GitHub Actions)
# required=false agar build lokal tanpa secret tetap bisa berjalan
RUN --mount=type=secret,id=composer_auth,env=COMPOSER_AUTH,required=false \
    composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --no-autoloader \
    --no-progress \
    --no-audit \
    --ignore-platform-reqs \
    --verbose

# ========================================================
# STAGE 2: Frontend Build (Node + Vite + TypeScript)
# ========================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

# Copy vendor agar TypeScript bisa resolve types ziggy-js
COPY --from=vendor /app/vendor ./vendor

COPY resources ./resources
COPY public ./public
COPY vite.config.* tsconfig.json ./

RUN npm run build

# ========================================================
# STAGE 3: Production Runtime (PHP 8.3 + Nginx)
# ========================================================
FROM php:8.3-fpm-alpine

# Environment Composer untuk runtime build
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1

# Install Nginx, Bash, runtime libraries untuk GD, ZIP, INTL
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng \
    libjpeg-turbo \
    freetype \
    libzip \
    icu-libs

# Install build dependencies & PHP extensions (dibutuhkan Laravel + Excel export)
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        bcmath \
        intl \
        opcache \
        pcntl \
        zip \
        gd \
    && apk del .build-deps

# Konfigurasi Keamanan PHP
RUN { \
        echo "session.upload_progress.enabled = 0"; \
        echo "expose_php = Off"; \
        echo "upload_max_filesize = 50M"; \
        echo "post_max_size = 50M"; \
        echo "memory_limit = 512M"; \
        echo "opcache.enable = 1"; \
        echo "opcache.enable_cli = 0"; \
        echo "opcache.memory_consumption = 128"; \
        echo "opcache.max_accelerated_files = 10000"; \
    } > /usr/local/etc/php/conf.d/docker-security-perf.ini

WORKDIR /var/www/html

# Composer CLI
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy vendor dari Stage 1
COPY --from=vendor /app/vendor ./vendor

# Copy source code aplikasi
COPY . .

# Generate optimized autoload & run package discovery
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Copy hasil build asset Vite dari Stage 2
COPY --from=frontend /app/public/build ./public/build

# Nginx config
COPY nginx/default.conf /etc/nginx/http.d/default.conf

# Entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Struktur storage dan permission
RUN mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
