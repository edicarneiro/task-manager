# ---- Etapa 1: Build da aplicação Angular ----
FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration production

# ---- Etapa 2: Servindo a aplicação com Nginx ----
FROM nginx:alpine

# Copia os arquivos de build da etapa anterior
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Exponha a porta 80 do Nginx
EXPOSE 80

# Inicia o Nginx quando o contêiner for executado
CMD ["nginx", "-g", "daemon off;"]
