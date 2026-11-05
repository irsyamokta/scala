# ========================================================
# STAGE 1: Backend Dependencies (Composer)
# ========================================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --no-autoloader \
    --ignore-platform-reqs

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
# STAGE 3: Production Runtime (PHP 8.3 Patched + Nginx)
# Keamanan: Versi 8.3.36+ kebal terhadap CVE-2026-109618 &
# CVE-2026-109619 (PHP2Shell UAF/OOM RCE).
# ========================================================
FROM php:8.3.36-fpm-alpine

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

# Konfigurasi Keamanan PHP (Mitigasi PHP2Shell & Hardening)
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
