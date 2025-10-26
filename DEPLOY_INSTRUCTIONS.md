# Инструкция по деплою на Netlify

## 🚀 Быстрый старт

### 1. Подготовка репозитория

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Подключение к Netlify

1. Зайдите на [app.netlify.com](https://app.netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите ваш Git провайдер (GitHub, GitLab, Bitbucket)
4. Выберите репозиторий
5. Нажмите **"Deploy site"**

### 3. Настройка Environment Variables

В Netlify Dashboard → Site settings → Environment variables добавьте:

```
Key: META_PIXEL_ACCESS_TOKEN
Value: <ваш токен>
Scope: Production, Deploy Previews, Branch deploys
```

**Готово!** Переменные уже настроены в `netlify.toml`:
- ✅ `NEXT_PUBLIC_META_PIXEL_ID` = "750660614671785"
- ✅ `META_PIXEL_ACCESS_TOKEN` - добавить через UI

## 📋 Что уже настроено

### Автоматические переменные (из netlify.toml):
- `NODE_VERSION` = 20
- `NEXT_TELEMETRY_DISABLED` = 1
- `NODE_OPTIONS` = --max-old-space-size=4096
- `NODE_ENV` = production
- `NEXT_PUBLIC_SITE_URL` = https://turbo-play.live
- `NEXT_PUBLIC_APP_NAME` = TurpoPlay
- `NEXT_PUBLIC_META_PIXEL_ID` = 750660614671785

### Edge Functions (автоматически):
- ✅ `bot-redirect`
- ✅ `bot-detector`
- ✅ `enhanced-protection`

### Заголовки безопасности:
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security

### Кэширование:
- ✅ Статические файлы (js, css)
- ✅ Изображения

## 🎯 Результат

После деплоя ваш сайт будет доступен по адресу:
- **Production**: `https://<your-site>.netlify.app`
- **Custom Domain**: Настройте в Netlify Dashboard

Meta Pixel будет работать автоматически!

## 📞 Поддержка

При проблемах с деплоем проверьте:
1. Build logs в Netlify
2. Environment variables установлены
3. Репозиторий подключен
4. Build command: `npm run build`
5. Publish directory: `out`

