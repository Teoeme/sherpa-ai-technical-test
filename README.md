# Sherpa AI - Prueba técnica
##### Este repositorio contiene el código fuente de la solución a la prueba técnica para el puesto de desarrollador Semi-señor para la empresa Sherpa AI, especializados en el desarrollo de automatizaciónes y soluciones potenciadas por inteligencia artificial para productores asesores de seguros y brokers.

```
 Postulante: Mancinelli Mateo Atilio
 Puesto: Developer Jr/Ssr
```

#### [Aquí](/enunciado.md) el enunciado de la prueba técnica

---

##  Descripción del Proyecto

Este proyecto implementa un web scraper automatizado que:

- Se autentica en una plataforma web
- Descarga manuscritos PDF en orden cronológico
- Extrae códigos de los PDFs usando patrones regex
- Resuelve desafíos de API para desbloquear manuscritos especiales
- Implementa algoritmos para completar la colección completa

##  Tecnologías Utilizadas

- **TypeScript** - Lenguaje principal
- **Playwright** - Automatización web

## 📦 Instalación y Ejecución

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Ejecutar el scraper:
```bash
npm run dev
```

### 3. Para producción:
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── index.ts                 # Punto de entrada principal
├── scrapping/
│   ├── scrapper.ts         # Clase principal del scraper
│   └── useCase/
│       ├── login.ts        # Lógica de autenticación
│       └── handleManuscripts.ts  # Procesamiento de manuscritos
temp/
└── manuscripts/            # PDFs descargados
```

##  Funcionalidades

- ✅ Autenticación automática
- ✅ Descarga de PDFs en orden cronológico
- ✅ Extracción de códigos usando regex
- ✅ Manejo de alerts y popups
- ✅ Peticiones HTTP a APIs externas

##  Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar versión compilada

---

**¡Listo para conquistar la cripta digital!** ⚔️
 


