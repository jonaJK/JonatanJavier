# Jonatan Javier - Test Angular - DEVSU

---

## 🚀 Tecnologías y Versiones

- **Framework:** Angular v21.2.0.
- **Lenguaje:** TypeScript v5.9.2.
- **Runtime/Package Manager:** npm v11.11.0.
- **Motor de Pruebas:** Jest v30.2.0.

---

## 🛠️ Configuración del Sistema

### Ejecución del proyecto

1 - Clonar el proyecto y moverse a la rama  `develop`

2 - Descarga todos los modulos necesarios con el comando:
```bash
npm install
```
3 - Para ejecutar la aplicación 
```bash
ng serve
```

4 - Para acceder a la aplicación `http://localhost:4200/ `

5 - Para ejecutar los test  
```bash
npm run test:coverage
```

### Proxy de Desarrollo

El proyecto redirige las peticiones a la API local para evitar problemas de CORS:

- **Ruta:** `/bp`
- **Destino:** `http://localhost:3002`
- **Seguridad:** Desactivada (`secure: false`) para facilitar pruebas locales.
  

### Alias de Rutas (Path Mapping)

| Alias         | Carpeta Destino      |
| :------------ | :------------------- |
| `@core/*`     | `src/app/core/*`     |
| `@shared/*`   | `src/app/shared/*`   |
| `@features/*` | `src/app/features/*` |

---

## 📦 Scripts de NPM

Ejecuta estos comandos desde la raíz del proyecto:

| Comando                 | Acción                                         |
| :---------------------- | :--------------------------------------------- |
| `npm install`           | Instala las dependencias.                      |
| `npm start`             | Inicia el servidor de desarrollo (`ng serve`). |
| `npm run build`         | Compila la aplicación para producción.         |
| `npm run watch`         | Compila y observa cambios en modo desarrollo.  |
| `npm test`              | Ejecuta las pruebas unitarias con **Jest**.    |
| `npm run test:watch`    | Ejecuta tests en modo interactivo.             |
| `npm run test:coverage` | Genera reporte de cobertura de código.         |

---

## 🧪 Pruebas Unitarias

El entorno de pruebas está configurado con `jest-preset-angular`.

- **Configuración principal:** `jest.config.ts`.
- **Setup:** Se inicializa mediante `src/setup-jest.ts`.

---
