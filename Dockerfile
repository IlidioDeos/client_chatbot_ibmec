FROM node:18-alpine

WORKDIR /app

# Instalar vite globalmente
RUN npm install -g vite

COPY package*.json ./

# Instalar todas as dependências, incluindo as de desenvolvimento
RUN npm install

COPY . .

EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]