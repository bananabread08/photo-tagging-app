import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Easy from './Difficulty/Easy';
import Medium from './Difficulty/Medium';
import Hard from './Difficulty/Hard';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import shuffle from './helpers/shuffle';

export default function RouteSwitch() {
  const [easyItems, setEasyItems] = useState([
    'Patrick',
    'Morty',
    'Pikachu',
    'Courage',
    'Jack',
    'Keanu',
    'Finn',
  ]);

  const [gameState, setGameState] = useState(false);

  const easyShuffle = () => {
    let arr = shuffle(easyItems);
    setEasyItems(arr);
  };

  const changeGameState = () => {
    setGameState(!gameState);
  };

  const revertGameState = () => {
    setGameState(false);
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar
          gameState={gameState}
          revertGameState={revertGameState}
          easyItems={easyItems}
        />
        <Routes>
          <Route
            path="/"
            element={
              <App
                changeGameState={changeGameState}
                easyShuffle={easyShuffle}
              />
            }
          ></Route>
          <Route path="/easy" element={<Easy easyItems={easyItems} />}></Route>
          <Route path="/medium" element={<Medium />}></Route>
          <Route path="/hard" element={<Hard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
