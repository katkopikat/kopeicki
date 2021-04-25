export default function createElement(tagName, classes, children, ...attr) {
  let element = null;
  try {
    element = document.createElement(tagName);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! Give a proper tag name.');
  }

  if (classes) {
    element.className = Array.isArray(classes) ? classes.join(' ') : classes;
  }

  if (children && Array.isArray(children)) {
    children.forEach((child) => element.append(child));
  } else if (children && typeof children === 'string') element.innerHTML = children;
  else if (children && typeof children === 'object') element.append(children);

  if (attr.length) {
    attr.forEach(([attrName, attrValue]) => {
      if (attrName.match(/id|maxlength|draggable|style|role|contenteditable|type|value|placeholder|onkeydown/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }

  return element;
}
