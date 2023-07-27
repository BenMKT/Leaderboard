import './styles.scss';

let leaderboard = [];

const user = document.getElementById('Inputname');
const score = document.getElementById('Inputscore');
const table = document.querySelector('.table_container');
const form = document.querySelector('.form');

const getScores = async () => {
  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/BenKGame/scores',
    );
    const json = await response.json();
    leaderboard = json.result;

    // Sort the leaderboard based on scores in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    table.innerHTML = '';
    leaderboard.forEach((dat) => {
      //   console.log(table);
      const row = document.createElement('tr');
      const name = document.createElement('td');
      name.className = 'point';
      name.textContent = `${dat.user}: ${dat.score}`;
      row.appendChild(name);
      table.appendChild(row);
    });
  } catch (error) {
    // Handle the error
  }
};

const addScore = async (userName, userScore) => {
  if (!userName || !userScore) {
    // Display an error message or perform appropriate action for empty inputs
    return;
  }

  try {
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
  } catch (error) {
    // Handle the error
  }
};

document.querySelector('.refresh').addEventListener('click', () => {
  getScores();
});

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault();
  addScore(user.value, score.value);
});

getScores();
