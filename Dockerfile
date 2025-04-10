# Use uma imagem base do Node.js 18
FROM node:18-alpine

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
