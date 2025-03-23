# EVE Image Helper

A lightweight utility to resolve EVE Online image URLs from entity IDs using ESI.

## Features

- Automatically detects ID type (character, corporation, alliance, item, etc.)
- Returns valid image URLs only
- Picks the best available image variant (e.g. render > icon)

## Usage

### HTML + JS Demo

```html
<script type="module">
  import EveImageResolver from './eve-image-resolver.js';

  const resolver = await EveImageResolver.create(587); // Rifter
  console.log(resolver.url);        // Best image URL (render, icon, etc.)
  console.log(resolver.variants);   // All valid variants
</script>
