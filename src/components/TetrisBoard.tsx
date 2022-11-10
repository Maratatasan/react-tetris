import React, { memo, useEffect, useRef,useState } from "react";
import { useBoard, tRow, tScene } from "./useBoard";
import { btLower, btUp , refresh} from "../assets";
const Board = (): JSX.Element => {
  const [boardDisplay, setBoardDisplay] = useState<tScene>()
  let [display, onControlShape, score, resetTetris] = useBoard();
  const eBoard = useRef<HTMLDivElement>(null);


  
  useEffect(focusBoard, []);



  function focusBoard() {
    if (eBoard.current) {
      eBoard.current.focus();
    }
  }

  return (
    <div
      ref={eBoard}
      className={"t-board"}
      tabIndex={0}
      onKeyDown={onControlShape}
    >
    
        <div className="t-heading">
          <h2>Mini React Tetris</h2>
        </div>
          <h3>Instructions</h3>
        <div className="t-instructions">
          <div className="t-navigation">
            <img src={btUp} alt="rotation key" />
            <div>Rotate</div>
          </div>
          <div className="t-navigation">
            <img src={btLower} alt="navigation keys" />
            <div>Move</div>
          </div>
          <div className="t-navigation" onClick={resetTetris}>
            <img src={refresh} alt="reset bt" />
            <div>To restart</div>
          </div>
    
        </div>
    
      <div className="t-score-container">
        <h1 className="t-score-label">Score: {score.toLocaleString()}</h1>
      </div>
      <div className="t-board-display">
        {display.map((row, index) => (
          <Row row={row} key={index} />
        ))}
      </div>
    </div>
  );
};

const Row = memo((props: { row: tRow }) => {
  return (
    <div className="t-row">
      {props.row.map((cell, index) => (
        <Cell cell={cell} key={index} />
      ))}
    </div>
  );
});

const Cell = memo((props: { cell: number }) => {
  return <div className={"t-cell t-cell-" + props.cell}></div>;
});

export default memo(Board);
