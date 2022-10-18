
const SHAPES = [
    {
        shape: [
            {x:0, y:0},
        ],
        width: 1,
        height: 1,
        rotate: false
    },

];

export function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
