import {RenderPosition} from "./const.js";

export const render = (component, container, position = RenderPosition.BEFOREEND) => {
  switch (position) {
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;

    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const appendChild = (component, parent) => {
  parent.appendChild(component.getElement());
};

export const removeChild = (component, parent) => {
  parent.removeChild(component.getElement());
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
