# Carpeta de Imágenes y Assets

Crea subcarpetas aquí para organizar tus assets:

## Estructura recomendada:

```
public/
├── images/
│   ├── gallery/          # Fotos para la galería
│   ├── hero/             # Imagen del hero
│   ├── about/            # Foto de perfil
│   └── logo/             # Logo del artista
├── videos/               # Videos (reels, etc)
└── fonts/                # Fuentes personalizadas
```

## Cómo usar:

En tus componentes React:

```jsx
<img src="/images/gallery/tattoo-1.jpg" alt="Tattoo" />
<video src="/videos/reel.mp4" />
```

---

**Nota**: Los archivos en la carpeta `public/` se sirven directamente en la raíz del sitio.
