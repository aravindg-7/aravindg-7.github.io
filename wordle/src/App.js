import './App.css';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function App() {

  return (
    <div className = 'container'>
    <header>
    <h1 className = 'text-white'>WORDLE CLONE</h1>
    </header>
    <div><Grid></Grid></div>
    
    </div>
  );
}

const Grid = () => {
  const [gridCells, setGridCells] = useState([]);
  // Generate initial grid cells
  useState(() => {
    const initialCells = [];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const cellKey = `${row}-${col}`;
        const cellContent = '';
        const cellColor = 'black'

        initialCells.push({ key: cellKey, content: cellContent, bgcolor: cellColor});
      }
    }

    setGridCells(initialCells);
  });

  // Render grid cells
  const renderGridCells = () => {
    return gridCells.map((cell) => (
      <div
        key={cell.key}
        className="grid-cell"
        style={{backgroundColor:cell.bgcolor}}
      >
        {cell.content}
      </div>
    ));
  };

  return (<div>
  <div className='board-container'>
  <div className="grid-container">{renderGridCells()}</div></div>
  <div id='#qwerty-container'><Qwerty setGridCells = {setGridCells} ></Qwerty></div>
  </div>);
};

const Qwerty =  ({setGridCells}) => {

  const [guess,setGuess] = useState([])
  const [score,setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [allowed, setAllowed] = useState([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [gameState, setGameState] = useState(false)
  const [colors, setColors] = useState({})
  useEffect(() => {
    var data;
    try {
      data = require('./allowed.json');
      setAllowed(data)
    } catch ( err ) {
      console.error(err)
    }

    try {
      data = require('./answers.json');
      let ans = Math.floor(Math.random() * data.length);
      setAnswer(data[ans])
      // setAnswer('booth')
    } catch ( err ) {
      console.error(err)
    }

  }, []);

  const processResult = (result) => {

    var count = 0

    for (let i = 0; i < result.length; i++) {
      if (guess[i] in colors === false){
        colors[guess[i]] = 0
      }
      colors[guess[i]] = Math.max(result[i],colors[guess[i]])
      setColors(colors)
      if (result[i] === 0) {
        updateGridColor('rgb(50,50,50)',`${score}-${i}`)
      }
      if (result[i] === 1) {
        updateGridColor('darkgoldenrod',`${score}-${i}`)
      }
      if (result[i] === 2) {
        updateGridColor('green',`${score}-${i}`)
        count += 1
      }
      if (colors[guess[i]] === 0) {
        const element = document.getElementById(guess[i]);
        element.style.backgroundColor = 'rgb(50,50,50)';
      }
      if (colors[guess[i]] === 1) {
        const element = document.getElementById(guess[i]);
        element.style.backgroundColor = 'darkgoldenrod';
      }
      if (colors[guess[i]] === 2) {
        const element = document.getElementById(guess[i]);
        element.style.backgroundColor = 'green';
      }
    }

    if (score === 5){
      setPopupOpen(true)
    }

    if (count === 5) {
      setPopupOpen(true)
      setGameState(true)
    }


  }

  const wordleOutput = (value) => {
    var res = [0,0,0,0,0]
    var count = {}
    for (let i = 0; i < value.length; i++) {
      if (answer[i] in count === false) {
        count[answer[i]] = 1
      }
      else {
        count[answer[i]] += 1
      }
    }

    for (let i = 0; i < value.length; i++) {
      if (value[i] === answer[i]) {
        res[i] = 2
        count[value[i]] -= 1
      }
    }
    for (let i = 0; i < value.length; i++) {
      if ((res[i] === 0) && (value[i] in count) && (count[value[i]] > 0)) {
        res[i] = 1
        count[value[i]] -= 1
      }
    }
    processResult(res)
  }



  const click = (e) => {
    if (guess.length === 5 &&(allowed.includes(guess.join('')) === false)){
      window.alert('Not a valid Word')
      for (let i = 0; i < guess.length; i++) {
        updateGrid('',`${score}-${i}`)
      }
      setGuess([])
    }
    else if (guess.length > 0 && e.target.value === 'del'){
      guess.pop()
      setGuess(guess)
      updateGrid('',`${score}-${guess.length}`)
    }
    
    else if (guess.length === 5 && e.target.value === 'enter'){
      // sendData()
      wordleOutput(guess)
      setGuess([])
      setScore(score+1)
    }

    else if(guess.length < 5 && e.target.value !== 'del' && e.target.value !== 'enter'){
      // console.log(guess,guess.length)
      updateGrid(e.target.value.toUpperCase(),`${score}-${guess.length}`)
      guess.push(e.target.value)
      setGuess(guess)

    }

  }
  // Update cell content when clicked
  const updateGrid = (value,cellKey) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.key === cellKey ? { ...cell, content: value } : cell
      )
    );
  };

  const updateGridColor = (value,cellKey) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.key === cellKey ? { ...cell, bgcolor: value } : cell
      )
    );
  };

  const refresh = () => {
    window.location.reload(false);
  }
  return (<div><div>
    <div className="keyboard-row">
            <button id = "q" value="q" onClick={ e => click(e) }>q</button>
            <button id = "w" value="w" onClick={ e => click(e) }>w</button>
            <button id="e" value="e" onClick={ e => click(e) }>e</button>
            <button id="r" value="r" onClick={ e => click(e) }>r</button>
            <button id="t" value="t" onClick={ e => click(e) }>t</button>
            <button id="y" value="y" onClick={ e => click(e) }>y</button>
            <button id="u" value="u" onClick={ e => click(e) }>u</button>
            <button id="i" value="i" onClick={ e => click(e) }>i</button>
            <button id="o" value="o" onClick={ e => click(e) }>o</button>
            <button id="p" value="p" onClick={ e => click(e) }>p</button>
          </div>
          <div className="keyboard-row">
            <div className="spacer-half"></div>
            <button id="a" value="a" onClick={ e => click(e) }>a</button>
            <button id="s" value="s" onClick={ e => click(e) }>s</button>
            <button id="d" value="d" onClick={ e => click(e) }>d</button>
            <button id="f" value="f" onClick={ e => click(e) }>f</button>
            <button id="g" value="g" onClick={ e => click(e) }>g</button>
            <button id="h" value="h" onClick={ e => click(e) }>h</button>
            <button id="j" value="j" onClick={ e => click(e) }>j</button>
            <button id="k" value="k" onClick={ e => click(e) }>k</button>
            <button id="l" value="l" onClick={ e => click(e) }>l</button>
            <div className="spacer-half"></div>
          </div>
          <div className="keyboard-row">
            <button value="enter" className="wide-button" onClick={ e => click(e) }>Enter</button>
            <button id="z" value="z" onClick={ e => click(e) }>z</button>
            <button id="x" value="x" onClick={ e => click(e) }>x</button>
            <button id="c" value="c" onClick={ e => click(e) }>c</button>
            <button id="v" value="v" onClick={ e => click(e) }>v</button>
            <button id="b" value="b" onClick={ e => click(e) }>b</button>
            <button id="n" value="n" onClick={ e => click(e) }>n</button>
            <button id="m" value="m" onClick={ e => click(e) }>m</button>
            <button value="del" className="wide-button" onClick={ e => click(e) }>Del</button>
          </div>
        </div>
        <div>
          <Popup open={popupOpen} modal closeOnDocumentClick={false}>

          {
          close => (
              <div className='modal'>
                { gameState &&
                  <h4 className='content'>
                      Score : {score}
                  </h4> }
                  <h4 className='content'>
                      The answer is : {answer.toUpperCase()}
                  </h4>
                  <div>
                      <button className='custbtn' onClick=
                          {() => refresh()}>
                              Play Again
                      </button>
                  </div>
              </div>
          )
          }
          </Popup>
        </div>
        </div>
  );
}


export default App;
