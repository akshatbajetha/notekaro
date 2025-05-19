import isWithinElement from "./isWithinElement";

function getElementAtPosition(x: any, y: any, elements: any) {
  if (!elements) return null;

  const element = elements.find((element: any) =>
    isWithinElement(x, y, element)
  );

  return element;
}

export default getElementAtPosition;
