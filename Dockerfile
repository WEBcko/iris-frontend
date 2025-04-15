# Use uma imagem base do Node.js 18
FROM node:18-alpine

# Argumentos para variáveis de ambiente do Vite
ARG VITE_API_URL
ARG VITE_ENCRYPTION_KEY

# Exporta para o processo de build (npm run build vai enxergar isso)
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENCRYPTION_KEY=$VITE_ENCRYPTION_KEY

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte
COPY . .

# Construa o projeto
RUN npm run build

# Instale o serve globalmente
RUN npm install -g serve

# Exponha a porta 3000
EXPOSE 3000

# Comando para servir a pasta de build na porta 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
