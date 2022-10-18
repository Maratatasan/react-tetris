import "./App.css";

import { randomShape } from "./shapes";

const COLUMNS = 10;
const ROWS = 20;

const createEmptyGrid = (): number[][] =>
  Array(ROWS).fill(Array(COLUMNS).fill(0));

const emptyDisplay = createEmptyGrid();

function randomNumber() {
  const num = Math.floor(Math.random() * 2);
  console.log(num);

  return num;
}

// const randomDisplay = emptyDisplay.map((row) => row.map(randomNumber));

function DisplayGrid(props: { emptyDisplay: number[][] }): JSX.Element {
  return (
    <div>
      {props.emptyDisplay.map((row, index) => {
        return <Row row={row} key={index} />;
      })}
    </div>
  );
}
function Row(props: { row: number[] }) {
  return (
    <div className="row">
      {props.row.map((cell, index) => {
        return <Cell cell={cell} key={index} />;
      })}
    </div>
  );
}
function Cell(props: { cell: number }) {
  return <div className={"cell cell-" + props.cell}></div>;
}



function App() {
  return (
    <div className="App">
      <h1>The app is online</h1>
      <DisplayGrid emptyDisplay={emptyDisplay} />
    </div>
  );
}

export default App;
