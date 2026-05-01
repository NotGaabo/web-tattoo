# Configuración de Tattoo Artist Landing Page

## Variables de Entorno (Opcional)

Si necesitas variables de entorno para integración con servicios:

```env
# .env.local
VITE_API_URL=https://api.example.com
VITE_EMAIL_SERVICE_ID=your-service-id
VITE_EMAIL_TEMPLATE_ID=your-template-id
```

## Servicios Integrados (Opcionales)

### 1. EmailJS (Para formulario de contacto)

```bash
npm install @emailjs/browser
```

Luego en `src/components/Contact.jsx`:

```javascript
import emailjs from "@emailjs/browser";

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await emailjs.sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      e.target,
      "YOUR_PUBLIC_KEY",
    );
    alert("Message sent!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 2. Analytics (Google Analytics)

```bash
npm install react-ga4
```

### 3. Fonts (Google Fonts)

Ya incluido en `index.html`. Para más, añade en `<head>`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap"
  rel="stylesheet"
/>
```

## Compresión de Imágenes

Las imágenes deben ser optimizadas:

```bash
# Instalar herramienta de optimización
npm install sharp

# O usar en línea: https://imagecompressor.com/
```

## PWA (Progressive Web App)

Para hacerlo PWA:

```bash
npm install workbox-webpack-plugin
```

## Performance

### Lighthouse Scores Objetivo

- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 100

### Optimizaciones Realizadas

- Code splitting automático con Vite
- CSS minificado
- Imágenes optimizadas
- Lazy loading en gallery

## Seguridad

- ✅ No expone claves API en cliente
- ✅ Sanitiza inputs del formulario
- ✅ CORS configurado para producción
- ✅ Content Security Policy ready

## Multiidioma (Opcional)

```bash
npm install i18next react-i18next
```

## Accesibilidad

Todas las secciones incluyen:

- ✅ Alt text en imágenes
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast WCAG AA

## Performance Checklist

- [ ] Imágenes optimizadas y comprimidas
- [ ] Cache busting en assets
- [ ] Minificación CSS/JS
- [ ] Lazy loading en gallery
- [ ] Defer scripts no críticos
- [ ] Precarga de fuentes

---

**Hecho con ❤️**
