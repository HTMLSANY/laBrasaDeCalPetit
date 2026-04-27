# La Brasa de Cal Petit — Web del restaurante

Web completa para un restaurante mediterráneo familiar ficticio en Barcelona.
Incluye carta con filtros, formulario de reservas conectado a Supabase y diseño totalmente responsive.

---

## Estructura de carpetas

```
la-brasa-cal-petit/
├── index.html              # Toda la estructura HTML (una sola página)
├── css/
│   ├── main.css            # Variables CSS, reset, tipografía y utilidades
│   ├── layout.css          # Navbar, hero, secciones y footer
│   ├── components.css      # Botones, tarjetas, formulario y mensajes
│   └── responsive.css      # Media queries mobile-first (sm, md, lg, xl)
├── js/
│   ├── supabase.js         # Inicialización del cliente Supabase
│   ├── reservas.js         # Validación y envío del formulario a Supabase
│   ├── menu.js             # Filtros de categoría de la carta
│   └── main.js             # Navbar con scroll, menú móvil y animaciones reveal
├── assets/
│   └── img/                # Carpeta para tus imágenes (ver notas abajo)
└── README.md               # Este archivo
```

---

## Cómo abrir el proyecto

### Opción A — VS Code + Live Server (recomendado)

1. Abre VS Code.
2. `Archivo > Abrir carpeta` y selecciona `la-brasa-cal-petit/`.
3. Instala la extensión **Live Server** (ritwickdey.liveserver) si no la tienes.
4. Haz clic derecho sobre `index.html` > **Open with Live Server**.
5. El navegador se abrirá en `http://127.0.0.1:5500`.

> Las reservas solo funcionan conectadas a Supabase (necesitas internet).
> El resto de la web funciona sin conexión.

### Opción B — Abrir directamente

Haz doble clic en `index.html`. Funciona para ver el diseño, pero el formulario
de reservas necesita un servidor local (usa Live Server).

---

## Configurar Supabase — SQL para ejecutar

Antes de probar el formulario de reservas, crea la tabla en tu proyecto Supabase:

1. Ve a [supabase.com](https://supabase.com) e inicia sesión.
2. Abre tu proyecto (`ihqajufaoybfvrrjhwyh`).
3. En el menú lateral, ve a **SQL Editor**.
4. Pega el siguiente SQL y haz clic en **Run**:

```sql
-- Crear la tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT        NOT NULL,
  telefono   TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  fecha      DATE        NOT NULL,
  hora       TIME        NOT NULL,
  personas   INTEGER     NOT NULL CHECK (personas BETWEEN 1 AND 10),
  notas      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activar Row Level Security
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede insertar (para el formulario público)
CREATE POLICY "insert_publico"
  ON reservas
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

5. Comprueba en **Table Editor** que la tabla `reservas` aparece correctamente.

---

## Añadir imágenes propias

Guarda tus fotos en `assets/img/` y sustituye los placeholders en `index.html`:

**Hero (fondo de pantalla completa):**
En `css/layout.css`, busca la sección `.hero` y cambia:
```css
/* Línea comentada de ejemplo: */
/* background-image: url('../assets/img/hero.jpg'); */
```
Por:
```css
background-image:
  linear-gradient(rgba(44,30,18,0.6), rgba(44,30,18,0.6)),
  url('../assets/img/hero.jpg');
background-size: cover;
background-position: center;
```

**Nosotros (foto del restaurante):**
En `index.html`, busca el bloque `.nosotros__img-placeholder` y sustitúyelo por:
```html
<img src="assets/img/restaurante.jpg" alt="Interior de La Brasa de Cal Petit"
     class="nosotros__foto">
```
Y en `css/layout.css` añade:
```css
.nosotros__foto {
  width: 100%;
  border-radius: var(--radio-lg);
  object-fit: cover;
  aspect-ratio: 4 / 3;
}
```

---

## Personalizar colores

Todas las variables de color están al inicio de `css/main.css` dentro de `:root {}`.
Cambia los valores hexadecimales para adaptar la paleta:

```css
:root {
  --color-primario:       #C9913A;  /* dorado — color principal de acento */
  --color-tierra:         #8B5E3C;  /* marrón tierra */
  --color-oliva:          #5C6B2F;  /* verde oliva */
  --color-fondo:          #FDF8F0;  /* blanco roto — fondo base */
  --color-fondo-dark:     #2C1E12;  /* marrón oscuro — hero y footer */
  /* ... resto de variables ... */
}
```

---

## Personalizar contenido

| Qué cambiar | Dónde |
|---|---|
| Nombre del restaurante | `index.html` — todas las ocurrencias |
| Dirección y teléfono | Sección `#contacto` en `index.html` |
| Horarios | Tabla `.horarios` en `index.html` |
| Platos de la carta | Artículos `.plato-card` en `index.html` |
| Historia del restaurante | Sección `#nosotros` en `index.html` |
| Año de fundación | Estadísticas `.nosotros__stats` y `.nosotros__badge` |
| Redes sociales | Bloque `.footer__social` en `index.html` |

---

## Stack técnico

- **HTML5** — estructura semántica, accesibilidad con ARIA
- **CSS3** — variables CSS, Grid, Flexbox, animaciones, mobile-first
- **JavaScript ES6+** — vanilla, módulo IIFE por archivo, sin frameworks
- **Supabase JS v2** — vía CDN, cliente inicializado en `supabase.js`
- **Google Fonts** — Playfair Display (títulos) + Lato (texto)
