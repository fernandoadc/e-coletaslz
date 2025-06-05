# Usa imagem oficial do Node
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Exponha a porta do React
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "start"]
