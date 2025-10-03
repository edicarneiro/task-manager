# STAGE 1: Build the Angular application
# Usamos a imagem Node completa para o processo de build, que é pesado.
FROM node:20 AS build
WORKDIR /app

# 1. Instala o Angular CLI globalmente para garantir que o comando 'ng' esteja no PATH
RUN npm install -g @angular/cli

# 2. Copia package files e instala dependências (Camada para cache)
COPY package.json package-lock.json ./
RUN npm install

# 3. Copia todos os arquivos fonte e executa o build de produção
COPY . .
# O build para o Angular 17+ (builder: application) coloca os arquivos em 'dist/frontend/browser'
RUN ng build frontend --output-path=dist/frontend --configuration=production

# STAGE 2: Serve com proxy
FROM node:20-slim AS final
WORKDIR /usr/share/app

# Instala dependências para o servidor
RUN npm install -g express http-proxy-middleware

# Copia os arquivos buildados
COPY --from=build /app/dist/frontend/browser .

# Cria package.json para o servidor
RUN echo '{\n\
  "name": "frontend-server",\n\
  "version": "1.0.0",\n\
  "dependencies": {\n\
    "express": "^4.18.2",\n\
    "http-proxy-middleware": "^2.0.6"\n\
  }\n\
}' > package.json

# Instala as dependências localmente
RUN npm install --production

# Cria o servidor Express com proxy
RUN echo "const express = require('express');\n\
const { createProxyMiddleware } = require('http-proxy-middleware');\n\
const path = require('path');\n\
\n\
const app = express();\n\
const PORT = 4200;\n\
\n\
console.log('🔧 Configurando servidor...');\n\
\n\
// Configuração do proxy para o backend\n\
app.use('/api', createProxyMiddleware({\n\
  target: 'http://backend:8080',\n\
  changeOrigin: true,\n\
  logLevel: 'debug',\n\
  onProxyReq: (proxyReq, req, res) => {\n\
    console.log('[PROXY] ➡️  Request:', req.method, req.url, '-> http://backend:8080' + req.url);\n\
  },\n\
  onProxyRes: (proxyRes, req, res) => {\n\
    console.log('[PROXY] ⬅️  Response:', proxyRes.statusCode, req.url);\n\
  },\n\
  onError: (err, req, res) => {\n\
    console.error('[PROXY] ❌ Error:', err.message);\n\
    res.status(500).send('Proxy error: ' + err.message);\n\
  }\n\
}));\n\
\n\
// Servir arquivos estáticos\n\
app.use(express.static(__dirname));\n\
\n\
// Fallback para SPA (todas as rotas vão para index.html)\n\
app.get('*', (req, res) => {\n\
  if (!req.url.startsWith('/api')) {\n\
    res.sendFile(path.join(__dirname, 'index.html'));\n\
  }\n\
});\n\
\n\
app.listen(PORT, '0.0.0.0', () => {\n\
  console.log('='.repeat(60));\n\
  console.log('🚀 Frontend server running');\n\
  console.log('📍 Port:', PORT);\n\
  console.log('📡 Proxy: /api -> http://backend:8080/api');\n\
  console.log('📂 Static files:', __dirname);\n\
  console.log('='.repeat(60));\n\
});\n\
\n\
process.on('SIGTERM', () => {\n\
  console.log('👋 Shutting down gracefully...');\n\
  process.exit(0);\n\
});" > server.js

EXPOSE 4200

CMD ["node", "server.js"]
