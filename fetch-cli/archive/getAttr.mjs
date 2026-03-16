export function getAttr(elem, name, defaultValue = "") {
  return elem.attributes.find((i) => i.name === name)?.value || defaultValue;
}
