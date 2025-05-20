# Portafy

Portafy es una aplicación web interna para asesores comerciales de call center, desarrollada con React y Firebase.

## Características

- 🔍 Buscador dinámico de promociones y productos
- 📝 Notas personales persistentes
- 📋 Sistema de copiado rápido de texto promocional
- 🛒 Armador de presupuestos
- 🔐 Autenticación con Google
- 👨‍💼 Panel de administración para gestionar promociones

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Firebase
- Proyecto de Firebase configurado

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd portafy
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar Firebase:
   - Crear un proyecto en Firebase Console
   - Habilitar Authentication (Google)
   - Habilitar Firestore Database
   - Copiar las credenciales de configuración
   - Reemplazar las credenciales en `src/config/firebase.js`

4. Configurar usuarios autorizados:
   - Crear una colección `authorizedUsers` en Firestore
   - Agregar documentos con el email de los usuarios autorizados
   - Asignar el rol 'admin' a los usuarios que administrarán las promociones

5. Iniciar la aplicación:
```bash
npm start
# o
yarn start
```

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes React
  ├── config/        # Configuración de Firebase
  ├── models/        # Modelos de datos
  ├── services/      # Servicios de Firebase
  ├── utils/         # Utilidades y helpers
  └── App.js         # Componente principal
```

## Uso

1. Iniciar sesión con Google
2. Usar el buscador para encontrar promociones
3. Crear y gestionar notas personales
4. Armar presupuestos
5. Copiar texto promocional al portapapeles

## Panel de Administración

Los usuarios con rol 'admin' pueden:
- Crear, editar y eliminar promociones
- Gestionar usuarios autorizados
- Ver estadísticas de uso

## Seguridad

- Autenticación mediante Google
- Validación de usuarios autorizados
- Reglas de seguridad en Firestore
- Protección de rutas administrativas

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto es de uso interno y privado.

## Autor

Desarrollado por Gaston Garcia Juri 