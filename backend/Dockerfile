# --- Etapa 1: Build ---
# Usamos una imagen de Node.js para construir el proyecto
FROM node:20-slim AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo las de desarrollo para compilar)
RUN npm install

# Copiamos el resto del código fuente del backend
COPY . .

# Compilamos el TypeScript a JavaScript
RUN npm run build

# --- Etapa 2: Producción ---
# Usamos una nueva imagen base, más ligera, para la versión final
FROM node:20-slim AS production

WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json otra vez
COPY package*.json ./

# Instalamos SOLAMENTE las dependencias de producción para mantener la imagen ligera
RUN npm install --only=production

# Copiamos los archivos compilados de la etapa de "build"
COPY --from=build /usr/src/app/dist ./dist

# Exponemos el puerto 8080 (el que Cloud Run espera)
EXPOSE 8080

# El comando para iniciar la aplicación. Cloud Run usará la variable de entorno $PORT.
CMD [ "node", "./dist/index.js" ]