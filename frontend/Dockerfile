# STAGE 1: Build the Angular application
# Usamos a imagem Node completa para o processo de build, que é pesado.
FROM node:20 AS build
WORKDIR /app

# 1. Instala o Angular CLI globalmente para garantir que o comando 'ng' esteja no PATH
RUN npm install -g @angular/cli

# 2. Copia package files e instala dependências (Camada para cache)
# CORREÇÃO CRÍTICA: Removido o prefixo 'frontend/'.
# O contexto de build já está em ./frontend, então os arquivos são acessados diretamente.
COPY package.json package-lock.json .
RUN npm install

# 3. Copia todos os arquivos fonte e executa o build de produção
COPY . .
# O build para o Angular 17+ (builder: application) coloca os arquivos em 'dist/browser'
RUN ng build --output-path=dist --configuration=production

# STAGE 2: Servir os arquivos estáticos (Slim Image)
# Usamos a imagem slim para o container final ser menor e mais seguro.
FROM node:20-slim AS final
WORKDIR /usr/share/app

# Instala o http-server
RUN npm install -g http-server

# CRÍTICO: Copia apenas o conteúdo do subdiretório 'browser' para a raiz do serving directory.
COPY --from=build /app/dist/browser .

# Define a porta padrão do Angular
EXPOSE 4200

# CRÍTICO: Usa a flag --spa para que todas as requisições sejam redirecionadas para o index.html.
CMD ["http-server", ".", "--port", "4200", "--spa"]
