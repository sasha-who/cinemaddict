import {RenderPosition} from "./const.js";

export const render = (element, container, position = RenderPosition.BEFOREEND) => {
  switch (position) {
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;

    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
  }
};
