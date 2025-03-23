class Image {
  constructor(id) {
    this.id = id;
    this.variants = {};
  }

  static async create(id) {
    const instance = new Image(id);
    const base = 'https://images.evetech.net';
    const esi = 'https://esi.evetech.net/latest';

    const nameRes = await fetch(`${esi}/universe/names/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([id])
    });

    const [nameData] = await nameRes.json();

    if (nameData?.category === 'inventory_type') {
      const typeRes = await fetch(`${esi}/universe/types/${id}/`);
      const typeData = await typeRes.json();
      const groupId = typeData.group_id;

      const groupRes = await fetch(`${esi}/universe/groups/${groupId}/`);
      const groupData = await groupRes.json();
      const categoryId = groupData.category_id;

      const categoryRes = await fetch(`${esi}/universe/categories/${categoryId}/`);
      const categoryData = await categoryRes.json();

      // Use category to determine valid image types
      switch (categoryId) {
        case 6: // Ship
          instance.variants.render = `${base}/types/${id}/render`;
          break;
        case 16: // Ancient Relics
          instance.variants.relic = `${base}/types/${id}/relic`;
          break;
        case 9: // Blueprint
          if (groupId === 332) {
            instance.variants.bp = `${base}/types/${id}/bp`;
          } else if (groupId === 333) {
            instance.variants.bpc = `${base}/types/${id}/bpc`;
          }
          break;
        default:
          instance.variants.icon = `${base}/types/${id}/icon`;
          break;
      }

    } else {
      const category = nameData?.category;
      switch (category) {
        case 'alliance':
          instance.variants.logo = `${base}/alliances/${id}/logo`;
          break;
        case 'corporation':
        case 'faction':
          instance.variants.logo = `${base}/corporations/${id}/logo`;
          break;
        case 'character':
          instance.variants.portrait = `${base}/characters/${id}/portrait`;
          break;
      }
    }

    return instance;
  }
}

window.Image = Image;