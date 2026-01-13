# Configuración de Claude Code

Esta carpeta contiene la configuración personalizada de Claude Code para el proyecto Todo List.

## Estructura

```
.claude/
├── settings.json                          # Configuración principal
├── plugins/                               # Plugins personalizados
│   └── react-native-dev/                 # Plugin de React Native
│       ├── plugin.json                   # Manifest del plugin
│       ├── README.md                     # Documentación
│       └── agents/                       # Agentes especializados
│           ├── setup-agent.json
│           ├── component-agent.json
│           ├── screen-agent.json
│           ├── test-agent.json
│           ├── build-agent.json
│           └── debug-agent.json
└── README.md                             # Este archivo
```

## Configuración

### settings.json
Contiene la configuración global del proyecto:
- Nombre y descripción del proyecto
- Plugins activos
- Modelo por defecto (Sonnet)
- Hooks pre/post comandos
- Instrucciones personalizadas

### Plugins

#### react-native-dev
Plugin completo para desarrollo React Native que incluye:

**Comandos:**
- `/rn-setup` - Inicializar proyecto
- `/rn-component` - Crear componentes
- `/rn-screen` - Crear pantallas
- `/rn-test` - Ejecutar tests
- `/rn-build` - Construir aplicación
- `/rn-debug` - Debuggear problemas

**Agentes:**
- setup-agent - Configuración inicial
- component-agent - Generación de componentes
- screen-agent - Creación de pantallas
- test-agent - Testing automatizado
- build-agent - Builds multiplataforma
- debug-agent - Análisis y debugging

## Hooks Configurados

- **before_commit**: Ejecuta lint y tests antes de commit
- **after_file_write**: Formatea código automáticamente

## Uso

Claude Code automáticamente detecta esta configuración y activa los plugins definidos. Puedes usar los comandos personalizados escribiendo `/` seguido del nombre del comando.

## Personalización

Para modificar la configuración:
1. Edita `settings.json` para cambios globales
2. Modifica `plugin.json` para cambios en el plugin
3. Actualiza los agentes en la carpeta `agents/` según necesites

## Modelo por Defecto

El proyecto está configurado para usar Claude Sonnet por defecto, que ofrece un buen balance entre velocidad y capacidad para tareas de desarrollo.
