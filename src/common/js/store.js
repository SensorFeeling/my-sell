export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function getFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller);
  if (!seller[id]) {
    return def;
  }
  return seller[id] || def;
};
