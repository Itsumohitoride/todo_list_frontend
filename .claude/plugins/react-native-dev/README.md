# React Native Development Plugin

Plugin personalizado para el desarrollo de aplicaciones React Native con soporte web y móvil.

## Descripción

Este plugin proporciona agentes especializados y comandos para facilitar el desarrollo de aplicaciones React Native con Expo, incluyendo soporte completo para web, iOS y Android.

## Comandos Disponibles

### `/rn-setup`
Inicializa y configura el proyecto React Native con Expo.
- Configura la estructura de carpetas
- Instala dependencias esenciales
- Configura TypeScript, ESLint y Prettier
- Prepara el entorno de testing

### `/rn-component`
Crea componentes React Native con TypeScript.
- Genera componentes funcionales con tipos
- Incluye estilos con StyleSheet
- Crea tests automáticamente
- Asegura compatibilidad multiplataforma

### `/rn-screen`
Crea nuevas pantallas con navegación configurada.
- Genera screens con navegación
- Configura SafeAreaView
- Incluye tipos de navegación
- Diseño responsive

### `/rn-test`
Ejecuta y crea tests para componentes.
- Ejecuta suite de tests con Jest
- Genera reportes de cobertura
- Crea tests unitarios
- Mocka dependencias

### `/rn-build`
Construye la aplicación para diferentes plataformas.
- Build para web, iOS y Android
- Configura perfiles de build
- Maneja certificados y signing
- Optimización para producción

### `/rn-debug`
Ayuda a debuggear problemas en la aplicación.
- Analiza errores y stack traces
- Identifica problemas de performance
- Limpia cachés
- Sugiere soluciones

## Agentes

- **setup-agent**: Inicialización del proyecto
- **component-agent**: Creación de componentes
- **screen-agent**: Creación de pantallas
- **test-agent**: Testing y cobertura
- **build-agent**: Builds multiplataforma
- **debug-agent**: Debugging y optimización

## Uso

Para usar los comandos, simplemente escribe el nombre del comando precedido por `/`:

```
/rn-setup
/rn-component MyButton
/rn-screen HomeScreen
/rn-test
/rn-build
/rn-debug
```

## Requisitos

- Node.js >= 16
- npm o yarn
- Expo CLI >= 49
- React Native >= 0.72
- TypeScript >= 5.0

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── screens/        # Pantallas de la aplicación
├── navigation/     # Configuración de navegación
├── services/       # Servicios y API calls
├── utils/          # Utilidades y helpers
└── types/          # Tipos de TypeScript
```
