# --- Etapa 1: Build (Construcción) ---
FROM node:20-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# --- CAMBIO IMPORTANTE ---
# Ejecutamos el script 'prebuild' que contiene 'npm run clean' (rimraf dist)
# Esto ASEGURA que la carpeta dist esté vacía antes de compilar.
RUN npm run prebuild

# Ahora compilamos sobre una base limpia.
RUN npm run build

# --- Etapa 2: Production (Producción) ---
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Copiamos la carpeta 'dist' recién generada y limpia desde la etapa de "build"
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]