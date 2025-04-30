FROM node:20-alpine3.20-slim AS builder

WORKDIR /app

# Copie apenas o necessário para instalar deps e aproveitar cache
COPY package.json package-lock.json ./
RUN npm ci          # dependências de produção apenas

# Copie o resto do código e faça o build
COPY . .
RUN npm run build              # produz a pasta dist/

FROM nginx:stable-alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
