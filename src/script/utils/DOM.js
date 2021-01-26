export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function moveToggle(container, length, isChecked) {
  const ball = container.querySelector('.ball');
  ball.style.transform = `translateX(${isChecked ? length : 0}px)`;
}
