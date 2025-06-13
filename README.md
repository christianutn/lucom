# 📋 LUCOM - Sistema de Gestión de Ventas Multicanal

[![Estado del proyecto](https://img.shields.io/badge/Estado-En%20desarrollo-yellow)](#)
[![Tecnologías](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20Google%20Sheets%20API%20%7C%20MySQL-blue)](#)

---

LUCOM es una **Aplicación - Formulario últil para la gestión de venta** para vendedores, agencias o centros de contacto que gestionan distintos tipos de servicios (Internet, Portabilidad, Convergencia, BBOO, etc.).

El sistema permite ingresar, consultar y almacenar ventas, gestionar clientes, domicilios, servicios contratados y sincronizar automáticamente los datos con hojas de cálculo de Google Sheets.

---

## 🚧 Estado del proyecto

> 🔧 Actualmente se encuentra en etapa de construcción activa.  
> Se están implementando los módulos de autenticación, ABMs y conexión con Google Drive.

---

## 🎯 Objetivo general

Centralizar el proceso de carga, consulta y gestión de ventas a través de un formulario interactivo, rápido y amigable para usuarios desde celular o PC, con validación, control de datos repetidos y envío automático a Google Sheets.

---

## 🧩 Funcionalidades principales

- 🔐 **Login de usuarios** (usuario y contraseña)
- 👥 ABM de usuarios y negocios
- 📌 Selección de tipo de venta: Internet, Portabilidad, BBOO
- 🧭 Selección de origen de datos (Redes sociales, terreno, llamada IN, etc.)
- 🧾 Formulario dinámico para carga de venta
  - Búsqueda de cliente por DNI/LE/CUIT
  - Asociación de domicilios
  - ABMs relacionados: barrios, tipos de domicilio, abonos, rangos horarios, compañías, gigas
- 🔄 Sincronización automática con **Google Sheets**
- 📱 Optimizado para dispositivos móviles y escritorio

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js + Express** – Servidor y API REST
- **Sequelize ORM** – Conexión con base de datos MySQL
- **JWT** – Autenticación segura por token
- **Google Sheets API** – Envío automático a hojas de cálculo
- **dotenv** – Configuración de variables de entorno
- **Jest** – Tests unitarios

### Frontend *(en progreso)*
- **React.js** – SPA moderna
- **Material UI** – Estilos responsivos


---

## 🧠 ABMs incluidos

- ✅ Usuarios
- ✅ Negocios
- ✅ Origen del dato
- ✅ Clientes y domicilios
- ✅ Barrios
- ✅ Tipos de domicilio
- ✅ Abonos
- ✅ Datos de servicio convergente
- ✅ Gigas
- ✅ Compañías actuales

---




