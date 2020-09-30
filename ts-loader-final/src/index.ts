function component() {
    const element = document.createElement('div');
    const val:string = 'Hello webpack'
    element.innerHTML = val;

    return element;
  }

  document.body.appendChild(component());
