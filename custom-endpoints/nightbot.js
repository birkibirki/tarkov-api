const ItemsAPI = require('../datasources/items');
const itemsAPI = new ItemsAPI();

function capitalize(s){
    return s && s[0].toUpperCase() + s.slice(1);
}

module.exports = async (request) => {
    await itemsAPI.init();
    const url = new URL(request.url);

    if(!url.searchParams.get('q')){
        return new Response(`Missing a query param called q`);
    }

    const items = itemsAPI.getItemsByName(url.searchParams.get('q'));

    if(items.length === 0){
        return new Response(`Found no item matching that name`);
    }

    const bestPrice = items[0].sellFor.sort((a, b) => b.price - a.price);


    return new Response(`${items[0].name} ${new Intl.NumberFormat().format(bestPrice[0].price)} ₽ ${capitalize(bestPrice[0].source)} https://tarkov.dev/item/${items[0].normalizedName}`);
};