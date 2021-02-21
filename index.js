const uniqueId = () => {
  const ch4 = () => Math.random().toString(16).slice(-4);
  return (
    ch4() +
    ch4() +
    "-" +
    ch4() +
    "-" +
    ch4() +
    "-" +
    ch4() +
    "-" +
    ch4() +
    ch4() +
    ch4()
  );
};

const wrapperElement = (tagName) => {
  return class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.renderTemplate();
    }
    renderTemplate() {
      this.innerHTML = this.render();
    }
    get currentElement() {
      return customElementsMap.get(tagName);
    }
    render() {
      return `<${tagName}-${this.currentElement.id} />`;
    }
  };
};

const patchRegistry = () => {
  Object.defineProperty(window, "customElements", {
    get: () => ({
      define(tagName, _class) {
        if (!nativeApi.get(tagName)) {
          const newElementId = uniqueId();
          customElementsMap.set(tagName, {
            definedClass: _class,
            id: newElementId,
          });
          nativeApi.define(tagName, wrapperElement(tagName));
          nativeApi.define(`${tagName}-${newElementId}`, _class);
        } else {
          const updatedElementId = uniqueId();
          customElementsMap.set(tagName, {
            definedClass: _class,
            id: updatedElementId,
          });
          nativeApi.define(`${tagName}-${updatedElementId}`, _class);
          updateLiveElements(tagName);
        }
      },
    }),
  });
};

const updateLiveElements = (tagName) => {
  const existentElements = document.getElementsByTagName(tagName);
  for (let element of existentElements) {
    element.renderTemplate();
  }
};

class TestElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = this.render();
  }
  render() {
    return "Test Element Template";
  }
}

class AnotherTestElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = this.render();
  }
  render() {
    return "Another Test Element Template";
  }
}

const customElementsMap = new Map();
const elementTagName = "test-element";
const nativeApi = customElements;
patchRegistry();

customElements.define(elementTagName, TestElement);
const testElement = document.createElement(elementTagName);
document.body.appendChild(testElement);

customElements.define(elementTagName, AnotherTestElement);
const anotherTestElement = document.createElement(elementTagName);
document.body.appendChild(anotherTestElement);
