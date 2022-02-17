import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Easy from './pages/Easy';
import Medium from './pages/Medium';
import Hard from './pages/Hard';
import Navbar from './navbar/Navbar';
import { useState, useEffect } from 'react';
import shuffle from './helpers/shuffle';
import easy from './helpers/data';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export default function RouteSwitch() {
  const [easyItems, setEasyItems] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      const data = await getDocs(collection(db, 'answers'));
      setAnswers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchAnswers();
  }, []);

  const easyShuffle = () => {
    let arr = shuffle([...easy]);
    const extractedArr = arr.filter((item, index) => {
      return index >= 0 && index < 3;
    });
    setEasyItems(extractedArr);
  };

  const changeGameState = () => {
    setGameState(!gameState);
  };

  const revertGameState = () => {
    setGameState(false);
  };

  const removeCorrectAnswers = (choice) => {
    console.log(choice);
    let reducedArr = easyItems.filter((item) => item.id !== choice.id);
    setEasyItems(reducedArr);
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
          <Route
            path="/easy"
            element={
              <Easy
                easyItems={easyItems}
                answers={answers}
                removeCorrectAnswers={removeCorrectAnswers}
              />
            }
          ></Route>
          <Route path="/medium" element={<Medium />}></Route>
          <Route path="/hard" element={<Hard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
