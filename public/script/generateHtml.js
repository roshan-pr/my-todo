const createElement = (tag, attributes, ...content) => {
  const tagView = document.createElement(tag);

  for (const key in attributes) {
    tagView[key] = attributes[key];
  }

  content.forEach(element => {
    if (typeof element === 'object') {
      tagView.appendChild(element);
      return;
    }
    tagView.innerText = element;
  });

  return tagView;
};

const generateHtml = ([tag, attributes, ...rest]) => {
  const childElements = rest.map(element =>
    Array.isArray(element) ? generateHtml(element) : element
  );

  return createElement(tag, attributes, ...childElements);
};
