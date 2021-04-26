import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * 関数Reactコンポーネント
 * 引数にpropsを受け取る
 * @param {*} props 
 * @returns React conponent or fragment
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

/**
 * クラスReactコンポーネント : Boardの状態を保存
 * Gameからstateをpropsとして受け取り、Squareにpropsとして渡す
 */
class Board extends React.Component {
  /**
   * Squareを生成する
   * @param {*} i:props
   * @returns React Conponent or Fragment
   */
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} // BoardのpropsからSquareのpropsへセット
        onClick={() => this.props.onClick(i)} // clickEventに関数を渡す
      />
    );
  }

  /**
   * レンダリング
   * @returns React component or fragment
   */
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/**
 * クラスReactコンポーネント : Gameの状態保存
 * rootへレンダリングされる
 * stateをフィールドに持ち、子孫にpropsとして渡す
 */
class Game extends React.Component {
  /**
   * renderされる時呼び出されるコンストラクタ
   * @param {*} props 
   */
  constructor(props) {
    super(props); // JavaScriptでは必須
    this.state = {
      history: [{
        squares: Array(9).fill(null), // 升目の値
      }],
      stepNumber: 0, // 進行した手番の数
      xIsNext: true, // 手番の真偽値
    };
  }

  /**
   * 過去の手番に戻る
   * @param {*} step 
   */
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  /**
   * Squareに渡されるクリック時処理
   * @param {*} i 
   */
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //履歴をコピー
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // コピーの生成: イミュータビリティのため
    if (calculateWinner(squares) || squares[i]) { // 勝者が決まるとreturn
      return;
    }
    // stateに値をセット
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ // concatはミューテートしない
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  /**
   * レンダリング
   * @returns React component or fragment
   */
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    /**
     * React component [<li>]:履歴ボタンを生成
     */
    const moves = history.map((step, move) => { // map:配列を処理して別の配列を生成
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}> {/* React componentリストを生成する場合はリスト内で一意なkeyを付与する */}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* tsxの中では{}でjsの値を使用する */}
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * OXゲーム勝利判定
 * @param {*} squares 
 * @returns winner('X' or 'O') or null
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
