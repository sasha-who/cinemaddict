import {RenderPosition} from "./const.js";

export const getRandomIntegerNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (elements) => {
  const randomIndex = getRandomIntegerNumber(0, elements.length - 1);

  return elements[randomIndex];
};

export const shuffleArray = (elements) => {
  const shuffledArray = elements.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const getRandomArrayItems = (elements) => shuffleArray(elements)
  .slice(0, getRandomIntegerNumber(1, elements.length));

export const castomizeDateFormat = (value) => value.toString().padStart(2, `0`);

export const generate = (count, generatorFunction) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(generatorFunction());
  }

  return result;
};

export const createElement = (template) => {
  const container = document.createElement(`div`);

  container.innerHTML = template;

  return container.firstChild;
};

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
