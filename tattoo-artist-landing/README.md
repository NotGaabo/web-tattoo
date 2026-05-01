# 🎨 Marcus Ink - Tattoo Artist Landing Page

Una **landing page moderna y premium** para un tatuador individual. Diseñada con un enfoque minimalista, colores negro, azul y blanco, e inspirada en el sitio de Stefano Alcantara.

---

## ✨ Características Principales

### 🎯 Secciones Completas

- **Hero**: Presentación impactante con animaciones
- **About**: Información del artista con estadísticas
- **Services**: Descripción de servicios ofrecidos
- **Gallery**: Galería de trabajos tipo masonry
- **Contact**: Formulario + información de contacto
- **Header & Footer**: Navegación sticky y redes sociales

### 🚀 Tecnología

- **React 18** - Librería de UI moderna
- **Vite** - Build tool ultra-rápido
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación
- **React Icons** - Iconografía
- **CSS3** - Estilos personalizados

### 🎨 Diseño

- Colores: Negro (#000000), Azul (#0066ff), Blanco (#ffffff)
- Responsive design (móvil, tablet, desktop)
- Animaciones suaves y elegantes
- Hover effects interactivos
- Gradientes y efectos glassmorphism

---

## 🚀 Inicio Rápido

### Opción 1: Scripts Automáticos

```bash
# Windows
start.bat

# macOS / Linux
chmod +x start.sh
./start.sh
```

### Opción 2: Manual

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
tattoo-artist-landing/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navegación principal
│   │   ├── Hero.jsx            # Sección hero
│   │   ├── About.jsx           # Información del artista
│   │   ├── Services.jsx        # Servicios ofrecidos
│   │   ├── Gallery.jsx         # Galería de trabajos
│   │   ├── Contact.jsx         # Formulario de contacto
│   │   ├── Footer.jsx          # Pie de página
│   │   └── [*.css]             # Estilos asociados
│   ├── pages/
│   │   └── Home.jsx            # Página principal
│   ├── styles/
│   │   └── index.css           # Estilos globales
│   ├── App.jsx                 # Componente raíz
│   ├── App.css                 # Estilos globales
│   └── main.jsx                # Punto de entrada
├── index.html                  # HTML principal
├── package.json                # Dependencias
├── vite.config.js              # Configuración Vite
├── start.bat & start.sh        # Scripts de inicio
└── README.md                   # Este archivo
```

---

## 🎨 Paleta de Colores

```css
--primary-black: #000000 /* Fondo principal */ --primary-blue: #0066ff
  /* Azul primario */ --primary-white: #ffffff /* Blanco principal */
  --secondary-blue: #0052cc /* Azul secundario */ --light-gray: #1a1a1a
  /* Grises claros */ --text-gray: #cccccc /* Texto gris */
  --border-gray: #333333 /* Bordes */;
```

---

## ⚙️ Personalización

### 1. **Datos Básicos** (Header & Footer)

Edita `src/components/Header.jsx` y `Footer.jsx`:

```jsx
<a href="mailto:tu-email@example.com">
<a href="tel:+1234567890">
```

### 2. **Contenido Hero**

Edita `src/components/Hero.jsx`:

```jsx
<h1>INK YOUR <span>SOUL</span></h1>
<p>Tu descripción aquí...</p>
```

### 3. **Información Personal (About)**

Edita `src/components/About.jsx`:

- Nombre y descripción
- Estadísticas (años, clientes, trabajos)
- Imagen de perfil

### 4. **Galería**

Edita `src/components/Gallery.jsx`:

```jsx
const galleryItems = [
  { id: 1, category: "Geometric", url: "TU_IMAGEN_URL" },
  // ... más items
];
```

### 5. **Servicios**

Edita `src/components/Services.jsx`:

```jsx
const services = [{ title: "Tu Servicio", description: "Descripción..." }];
```

### 6. **Formulario de Contacto**

Edita `src/components/Contact.jsx`:

- Integra con un servicio de email (FormSubmit, EmailJS, etc.)

---

## 🌐 Reemplazar Imágenes

Las imágenes actualmente usan URLs de **Unsplash**. Para usar tus propias imágenes:

1. Crea una carpeta `public/images/` en la raíz
2. Agrega tus imágenes
3. Reemplaza las URLs:

```jsx
// De:
src = "https://images.unsplash.com/photo-...";

// A:
src = "/images/tu-imagen.jpg";
```

---

## 📧 Integración de Email

Para el formulario de contacto, integra un servicio como:

### Opción A: FormSubmit

```jsx
<form action="https://formsubmit.co/tu-email@example.com" method="POST">
  {/* Campos del formulario */}
</form>
```

### Opción B: EmailJS

```bash
npm install @emailjs/browser
```

---

## 🔗 Secciones con Navegación

El header tiene enlaces directos a cada sección:

```jsx
<a href="#about">ABOUT</a>
<a href="#gallery">GALLERY</a>
<a href="#contact">CONTACT</a>
```

---

## 📱 Responsividad

El diseño es totalmente responsive:

- ✅ Móvil (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

Los breakpoints están en los archivos CSS de cada componente.

---

## 🎬 Animaciones

Todas las animaciones usan **Framer Motion**:

- Entrada en scroll
- Hover effects
- Transiciones suaves
- Loading states

Personaliza en cada componente:

```jsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Sube la carpeta `dist/` a Netlify
```

### GitHub Pages

```bash
npm run build
# Configura en Settings > Pages > Deploy from branch
```

---

## 📝 Notas

- **Estilo**: Inspirado en stefanoalcantara.tattoo
- **Colores**: Negro, Azul y Blanco según especificación
- **Animaciones**: Fluidas y elegantes (no invasivas)
- **Performance**: Optimizado con Vite
- **SEO**: Incluye meta tags en index.html

---

## 🛠️ Troubleshooting

### npm install falla

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 5173 ocupado

```bash
npm run dev -- --port 3000
```

### Build no funciona

```bash
npm run build
npm run preview
```

---

## 📞 Soporte & Créditos

- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Framer Motion**: https://framer.com/motion
- **Unsplash**: https://unsplash.com (imágenes)

---

## 📄 Licencia

Libre para usar y personalizar.

---

**¡Hecho con ❤️ para tatuadores!**
