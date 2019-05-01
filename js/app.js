/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

const game = document.querySelector('.game');
const dicesImg = document.querySelector('.dices');
const currentScore = document.querySelectorAll('.result');
const rollButton = document.querySelector('.buttons > button:first-child');
const holdButton = document.querySelector('.buttons > button:last-child');
const playerScores = document.querySelectorAll('.game__play');
const player = document.querySelectorAll('.game__players > .player');

const dices = {
  'dice-1.png': 1,
  'dice-2.png': 2,
  'dice-3.png': 3,
  'dice-4.png': 4,
  'dice-5.png': 5,
  'dice-6.png': 6
};

const getRandom = (rangeStart, rangeEnd) => {
  return Math.floor(Math.random() * rangeEnd + rangeStart);
};

const getRandomDiceImageSrc = randomNumber => {
  return `./img/dice-${randomNumber}.png`;
};

const getRandomDicePath = () => {
  const randDiceNumber = getRandom(1, 6);
  return [getRandomDiceImageSrc(randDiceNumber), randDiceNumber];
};

const diceImgLiteral = () => {
  const [path, number] = getRandomDicePath();
  return `
    <img class="dices__img" src="${path}" data-dice-value="${number}" />
  `;
};

const createDiceLiterals = n => {
  let result = '';
  for (let i = 1; i <= n; i++) {
    result += diceImgLiteral();
  }
  return result;
};

const sumDices = () => {
  const dices = [...dicesImg.querySelectorAll('.dices__img')];
  return dices.reduce((acc, item) => acc + Number(item.dataset.diceValue), 0);
};

function rollDice() {
  dicesImg.classList.remove('img--hidden');
  const playerCurrentResultElem = currentScore[0].children[1];
  dicesImg.innerHTML = createDiceLiterals(2);
  playerCurrentResultElem.textContent =
    Number(playerCurrentResultElem.textContent) + sumDices();
}

rollButton.addEventListener('click', rollDice);

holdButton.addEventListener('click', function() {
  const playerOverallScore = playerScores[0].querySelectorAll('.score');
  const activePlayerElem = player[0].querySelector('.player__active');
  const playerCurrentResult = currentScore[0].children[1];

  playerOverallScore[0].textContent =
    Number(playerOverallScore[0].textContent) +
    Number(playerCurrentResult.textContent);
  playerCurrentResult.textContent = 0;
  player[0].removeChild(activePlayerElem);
  player[1].appendChild(activePlayerElem);
  game.classList.remove('background--left');
  game.classList.add('background--right');
  player[0].children[0].classList.toggle('light--text');
  player[1].children[0].classList.toggle('light--text');
  playerOverallScore[0].classList.toggle('light--text');
  playerOverallScore[1].classList.toggle('light--text');
});
