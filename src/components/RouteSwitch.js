import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Easy from './pages/Easy';
import Medium from './pages/Medium';
import Hard from './pages/Hard';
import Navbar from './navbar/Navbar';
import Leaderboard from './pages/Leaderboard';
import { useState, useEffect } from 'react';
import shuffle from './helpers/shuffle';
import easy from './helpers/data';
import { fetchAnswers, fetchUsers, submitUser } from './firebase/firebase';

export default function RouteSwitch() {
  const [easyItems, setEasyItems] = useState(['x']);
  const [gameState, setGameState] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(0);
  //const [endTime, setEndTime] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAnswers(setAnswers);
    fetchUsers(setUsers);
    console.log('fetching');
  }, []);

  useEffect(() => {
    if (easyItems.length === 0) {
      console.log(`${name} finished the game`);
      submitUser(name, startTime, getCurrentTime());
      // console.log(endTime);
    }
  });

  function getCurrentTime() {
    let today = new Date();
    let totalSeconds =
      today.getHours() * 60 * 60 + today.getMinutes() * 60 + today.getSeconds();
    return totalSeconds;
  }

  function getStartTime() {
    setStartTime(getCurrentTime());
  }

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const easyShuffle = () => {
    let arr = shuffle([...easy]);
    const extractedArr = arr.filter((item, index) => {
      return index >= 0 && index < 3;
    });
    setEasyItems(extractedArr);
  };

  const startGame = () => {
    setGameState(true);
  };

  const revertGameState = () => {
    setGameState(false);
    setEasyItems(['x']);
    setName('');
    setStartTime(0);
  };

  const removeCorrectAnswers = (choice) => {
    let reducedArr = easyItems.filter((item) => item.id !== choice.id);
    setEasyItems((prevState) => (prevState = reducedArr));
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
                startGame={startGame}
                easyShuffle={easyShuffle}
                handleChange={handleChange}
                name={name}
                getStartTime={getStartTime}
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
                name={name}
                getCurrentTime={getCurrentTime}
              />
            }
          ></Route>
          <Route path="/medium" element={<Medium />}></Route>
          <Route path="/hard" element={<Hard />}></Route>
          <Route
            path="/leaderboard"
            element={<Leaderboard users={users} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
