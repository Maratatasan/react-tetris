import React, {
  KeyboardEventHandler,
  useEffect,
  useState,
  useRef,
} from "react";
import { useInterval } from "./useInterval";

import { randomShape, tShape } from "./shapeFactory";

export const ROW_COUNT = 20;
export const COLUMN_COUNT = 10;
const START_POSITION: tPosition = { x: 4, y: 0 };

export type tRow = number[];
export type tScene = tRow[];

interface tPosition {
  x: number;
  y: number;
}

function copyScene(scene: tScene) {
  return scene.map((row) => row.slice());
}

function updateScene(
  scene: tScene,
  shape: tShape,
  position: tPosition
): tScene {
  let updatedScene = copyScene(scene);

  for (let cell of shape.model) {
    // x & y is the new shape's cell position
    const x = cell.x + position.x;
    const y = cell.y + position.y;
    // the board is 10x20, of 1's and 0's
    // 0's are empty, 1's are filled
    let activeCell = 1;

    // skip if
    if (x < 0 || x >= COLUMN_COUNT || y < 0 || y >= ROW_COUNT) {
      continue;
    }

    // if there is something
    // no need to update
    if (scene[y][x] === activeCell) {
      continue;
    }

    updatedScene[y][x] = activeCell;
  }

  return updatedScene;
}

function createEmptyScene() {
  return Array.from(Array(ROW_COUNT), () => Array(COLUMN_COUNT).fill(0));
}

/* <------ The useBoard hook is responsible for the game logic -------> */

export function useBoard(): [
  display: tScene,
  onControlShape: KeyboardEventHandler,
  score: number
] {
  const [scene, setScene] = useState(() => createEmptyScene());
  const [shape, setShape] = useState(() => randomShape());
  const [position, setPosition] = useState(START_POSITION);
  const [display, setDisplay] = useState(scene);
  const [score, setScore] = useState(0);
  const shapeRotation = useRef(-1);

  useEffect(updateDisplay, [scene, shape, position]);
  useEffect(removeFullLines, [scene]);
  function updateDisplay() {
    // the scene only tracks placed shapes and position
    // the display is the scene + the current shape
    // current shape is derived and validated from the position
    const newDisplay = updateScene(scene, shape, position);
    setDisplay(newDisplay);
  }

  // movePosition() is called in the conditional ternary statement
  // and moves the shape down
  const tick = () => (!movePosition(0, 1) ? placeShape() : null);
  useInterval(tick, 600);

  function placeShape() {
    setScene(updateScene(scene, shape, position));
    setShape(randomShape());
    setPosition(START_POSITION);
    shapeRotation.current = -1;
  }

  // arrow function is used to have access to the scope where it is declared
  // meaning that it has access to the variables and function references declared in the useBoard hook
  const onControlShape = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    switch (event.key) {
      case "ArrowRight":
        movePosition(1, 0);
        event.preventDefault();
        break;
      case "ArrowLeft":
        movePosition(-1, 0);
        event.preventDefault();
        break;
      case "ArrowDown":
        movePosition(0, 1);
        event.preventDefault();
        break;
      case "ArrowUp":
        if (shape.rotate) {
          rotateShape();
        }
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  function rotateShape() {

    const tX = Math.floor(shape.width / 2);
    const tY = Math.floor(shape.height / 2);

    const newPoints = shape.model.map((cell) => {
      let { x, y } = cell;

      x -= tX;
      y -= tY;

      // cos 90 = 0, sin 90 = 1
      // x = x cos 90 - y sin 90 = -y
      // y = x sin 90 + y cos 90 = x
      let rX = -y;
      let rY = x;

      rX += tX;
      rY += tY;

      return { x: rX, y: rY };
    });

    if (shape.rotations) {
      shapeRotation.current = shapeRotation.current + 1;

      if (shapeRotation.current > shape.rotations!.length - 1) {
        shapeRotation.current = 0;
      }
    }

    const rotatedShape: tShape = {
      ...shape,
      model: newPoints,
    };

    if (isValidPosition(position, rotatedShape)) {
      setShape(rotatedShape);
    }
  }

  return [display, onControlShape, score];

  function movePosition(x: number, y: number): boolean {
    const updatedPosition = { x: position.x + x, y: position.y + y };
    if (!isValidPosition(updatedPosition, shape)) {
      // the returns are used to know when to place the shape
      return false;
    }
    setPosition(updatedPosition);

    return true;
  }

  function isValidPosition(position: tPosition, shape: tShape) {
    return shape.model.every((cell) => {
      const tX = cell.x + position.x;
      const tY = cell.y + position.y;

      // out of x boundaries
      if (tX < 0 || tX >= COLUMN_COUNT) {
        return false;
      }

      // out of y boundaries
      if (tY < 0 || tY >= ROW_COUNT) {
        return false;
      }

      // if there is something
      if (scene[tY][tX] !== 0) {
        return false;
      }

      return true;
    });
  }

  function removeFullLines() {
    const newScene = copyScene(scene);
    let touched = false;

    for (let y = 0; y < ROW_COUNT; y++) {
      let rowHasEmptySpace = newScene[y].includes(0);
      if (!rowHasEmptySpace) {
        removeRow(y);
      }
    }

    if (touched) {
      setScene(newScene);
    }

    function removeRow(rowIndex: number) {
      // moving all rows down
      for (let y = rowIndex; y > 0; y--) {
        newScene[y] = newScene[y - 1];
      }

      // insert blank row at top
      newScene[0].map((cell) => 0);

      touched = true;
      setScore((oldValue) => oldValue + 1000);
    }
  }
}
