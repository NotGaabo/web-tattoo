# 📋 Quick Start Guide - Marcus Ink

## Primera vez corriendo el proyecto?

### ⚡ 3 pasos rápidos:

#### 1. Instalar Node.js (si no lo tienes)

- Descarga desde: https://nodejs.org/
- Versión recomendada: 18.0+

#### 2. Instalar y ejecutar

```bash
# Windows
start.bat

# macOS / Linux
./start.sh

# O manualmente:
npm install
npm run dev
```

#### 3. ¡Listo!

Abre tu navegador en `http://localhost:5173`

---

## 🎨 Personalizar tu Landing

### Cambiar nombre del artista

Busca "Marcus" y "MARCUS INK" en:

- `src/components/Header.jsx`
- `src/components/Hero.jsx`
- `src/components/About.jsx`
- `src/components/Footer.jsx`
- `index.html`

### Cambiar colores

Edita `src/styles/index.css`:

```css
--primary-blue: #0066ff; /* Tu color aquí */
```

### Cambiar imágenes

En cada componente:

```jsx
<img src="https://images.unsplash.com/..." />
// Reemplaza con:
<img src="/images/tu-imagen.jpg" />
```

### Cambiar información de contacto

`src/components/Contact.jsx`:

```jsx
marcus@ink.com  → tu-email@example.com
+1 (234) 567-890 → tu-número
New York, NY → tu-ciudad
```

---

## 📁 Carpetas importantes

```
src/
├── components/    ← Dónde está todo visible
├── pages/         ← Estructura de páginas
└── styles/        ← Colores y CSS global
```

---

## 🚀 Comandos útiles

```bash
npm run dev       # Desarrollo (hot reload)
npm run build     # Construir para producción
npm run preview   # Ver build de producción
```

---

## 🎬 Próximos pasos

1. **Integrar email**: Usa EmailJS o FormSubmit
2. **Agregar imágenes**: Reemplaza URLs de Unsplash
3. **Personalizar**: Cambia textos y colores
4. **Deploy**: Sube a Vercel o Netlify

---

## 📞 Soporte

**Problema**: npm install falla
**Solución**: `rm -rf node_modules && npm install`

**Problema**: Puerto ocupado
**Solución**: `npm run dev -- --port 3000`

**Problema**: Cambios no aparecen
**Solución**: Recarga la página (Ctrl+Shift+R)

---

¡Buena suerte! 🎨✨
