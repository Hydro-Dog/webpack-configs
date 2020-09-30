function component() {
    const element = document.createElement('div');
    const val = 'Hello webpack 2'
    element.innerHTML = val;

    return element;
  }

  document.body.appendChild(component());