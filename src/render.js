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
