const getContainerWidth = (containerId) => {
  let widgetContainer = containerId ? document.querySelector(
    `#${containerId}`) : document.body;
  const {width} = widgetContainer.getBoundingClientRect();
  return width;
}
const isMobile = (containerId) => {
  const maxContainerWid = 750;
  return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) || getContainerWidth(containerId) < maxContainerWid;
}

export default {
  isMobile
}
