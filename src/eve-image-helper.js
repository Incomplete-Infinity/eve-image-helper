class Image {
  constructor(id) {
    this.id = id;
    this.url = null;
    this.variants = {};
  }

  static async create(id) {
    const instance = new Image(id);
    const res = await fetch(`https://esi.evetech.net/latest/universe/names/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([id])
    });

    const [{ category }] = await res.json();
    const base = 'https://images.evetech.net';

    const allVariants = {
      alliance: [`${base}/alliances/${id}/logo`],
      corporation: [`${base}/corporations/${id}/logo`],
      faction: [`${base}/corporations/${id}/logo`],
      character: [`${base}/characters/${id}/portrait`],
      inventory_type: [
        `${base}/types/${id}/render`,
        `${base}/types/${id}/icon`,
        `${base}/types/${id}/bp`,
        `${base}/types/${id}/bpc`,
        `${base}/types/${id}/relic`
      ]
    }[category] || [];

    const validEntries = await Promise.all(
      allVariants.map(async url => [url, await Image.checkImageExists(url)])
    );

    instance.variants = Object.fromEntries(
      validEntries.filter(([, ok]) => ok)
    );

    instance.url = Object.keys(instance.variants)[0] || null;

    return instance;
  }

  static checkImageExists = url =>
    fetch(url, { method: 'HEAD' })
      .then(res => res.ok)
      .catch(() => false);
}
