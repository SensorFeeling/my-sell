export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    for (let item in arr) {
      let tempArray = item.substring(1).split('=');
      let key = decodeURIComponent(tempArray[0]);
      let value = decodeURIComponent(tempArray[1]);
      obj[key] = value;
    }
  }
  return obj;
}
