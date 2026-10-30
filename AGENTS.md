# Directrices del Proyecto y Agente (AGENTS.md)

Directrices de desarrollo, matriz de autonomía y estándares operativos para Kinky Finger Picker.

---

## 1. Directrices de Comportamiento (Behavioral Guidelines)

**Criterio:** Priorizar la cautela y la precisión sobre la velocidad apresurada.

### Think Before Coding
- No asumas. Declara supuestos explícitamente.
- Si existen múltiples interpretaciones válidas o dudas sobre requerimientos, pregunta antes de codificar.
- Si existe una solución más simple y directa, menciónala.

### Simplicity First
- Escribe el código mínimo indispensable para resolver el problema. Nada especulativo.
- Sin funcionalidades adicionales no solicitadas ni abstracciones prematuras para código de un solo uso.
- Si un componente puede resolverse limpiamente con componentes nativos de React Native Web, no agregues dependencias pesadas.

### Surgical Changes
- Toca únicamente los archivos y líneas necesarios para cumplir la tarea.
- Respeta y emula el estilo existente del proyecto (TypeScript estricto, React 19, componentes funcionales con hooks).
- No refactorices código funcional no relacionado con la solicitud.

### Goal-Driven Execution
- Transforma solicitudes en objetivos verificables.
- Ejecuta `npm run typecheck` (`tsc --noEmit`) y `npm test` antes de considerar una tarea completada.

---

## 2. Matriz de Autonomía

### Actúa de forma autónoma (sin pedir confirmación previa):
- Operaciones de solo lectura: listar directorios, inspeccionar logs, leer archivos.
- Instalación de dependencias mediante `npm`.
- Ejecución de tests (`npm test`), builds (`npm run build:web`), linters y typechecks (`npm run typecheck`).
- Operaciones Git estándar: `add`, `commit`, `push`, `pull`, `checkout`, `status`, `diff` (no destructivas).

### Confirma antes de ejecutar:
- Eliminar datos, volúmenes o archivos importantes del proyecto.
- Modificar credenciales, secretos o tokens de API.
- Operaciones Git destructivas: `force push`, `reset --hard`, `clean -f`.

---

## 3. Stack Tecnológico y Comandos del Proyecto

- **Framework:** React Native `0.81.5` con Expo SDK `~54.0.30` y TypeScript `~5.9.2`.
- **Bundler Web:** Metro nativo (`expo export -p web`, salida en `dist/`).
- **Navegación:** Máquina de estados ligera en `App.tsx` (`useState<Screen>` + `ScreenTransition`). No usar `@react-navigation`.
- **Compatibilidad:**
  - Táctil multipunto nativo en móviles y tablets.
  - Fallback de mouse para pruebas y juego en navegadores de escritorio.
  - Soporte PWA (`public/manifest.json`, viewport fit-cover, touch-action: none).
- **Comandos frecuentes:**
  - `npm run web`: Iniciar servidor de desarrollo Metro para web.
  - `npm run build:web`: Exportar build estático optimizado a `dist/`.
  - `npm run serve:web`: Servir la build estática localmente en `http://localhost:3005`.
  - `npm test`: Ejecutar suite de pruebas Jest.
  - `npm run typecheck`: Validar tipos con TypeScript.

---

## 4. Gestión de Credenciales y Entorno

- **NUNCA** incrustes claves de API, tokens o contraseñas en texto plano dentro del código.
- Las credenciales seguras se cargan desde variables de entorno (`$GITHUB_TOKEN`, `$ZAI_API_KEY`, etc.).
