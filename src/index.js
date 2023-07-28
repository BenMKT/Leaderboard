import './styles.scss';

let leaderboard = [];

const user = document.getElementById('Inputname');
const score = document.getElementById('Inputscore');
const table = document.querySelector('.table_container');
const form = document.querySelector('.form');

const getScores = async () => {
  
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/BenKGame/scores',
    );
    const json = await response.json();
    leaderboard = json.result;

    const uniqueScores = new Set();
    // Loop through the leaderboard array and add each user and score pair to the Set
    leaderboard.forEach((dat) => {
      uniqueScores.add(`${dat.user}: ${dat.score}`);
    });
    // Convert the Set back to an array
    leaderboard = Array.from(uniqueScores);
    // Sort the leaderboard based on scores in descending order
    leaderboard.sort((a, b) => b.split(': ')[1] - a.split(': ')[1]);
    // console.log(leaderboard);
    table.innerHTML = '';
    leaderboard.forEach((entry) => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      name.className = 'point';
      name.textContent = entry;
      row.appendChild(name);
      table.appendChild(row);
    });
  } 

const addScore = async (userName, userScore) => {
  if (!userName || !userScore) {
    // Display an error message or perform appropriate action for empty inputs
    return;
  }

    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/BenKGame/scores',
      {
        method: 'POST',
        body: JSON.stringify({
          user: userName,
          score: Number(userScore),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();
    if (json.response === 'Leaderboard score created.') {
      getScores();
    }
    form.reset();
    // user.value = '';
    // score.value = '';
};

document.querySelector('.refresh').addEventListener('click', () => {
  getScores();
});

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault();
  addScore(user.value, score.value);
});

getScores();
