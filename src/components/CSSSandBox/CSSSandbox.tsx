import "./CSSSandbox.css";
export default function CSSSandbox() {
  return (
    <>
      <h1>
        Using <code>grid-area</code>
      </h1>
      <div className="container">
        <div className="item a">Move History</div>
        <div className="item b">Save Opening</div>
        <div className="item c">Chessboard</div>
        <div className="item d">Move Back Button</div>
        <div className="item e">Move Forward Button</div>
      </div>
    </>
  );
}
