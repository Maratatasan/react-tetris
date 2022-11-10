interface tModel {
  x: number;
  y: number;
}

export interface tShape {
  name: string;
  model: tModel[];
  rotations?: [tModel[], tModel[], tModel[]?, tModel[]?];
  width: number;
  height: number;
  rotate: boolean;
}

const SHAPES: tShape[] = [
  {
    name: "I",
    model: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
    width: 1,
    height: 4,
    rotate: true,
    rotations: [
      [
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ],
    ],
  },
  {
    name: "L",
    model: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],

    width: 2,
    height: 3,
    rotate: true,
  },

  {
    name: "O",
    model: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    width: 1,
    height: 3,
    rotate: false,
  },
  {
    name: "T",
    model: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ],

    width: 3,
    height: 2,
    rotate: true,
  },
];

export function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
