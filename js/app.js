/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

'use strict';

class Game {
  constructor() {
    this._gameState = 'active';
    this._game = document.querySelector('.game');
    this._dicesImg = document.querySelector('.dices');
    this._currentScore = document.querySelectorAll('.result');
    this._rollButton = document.querySelector('.buttons > button:first-child');
    this._holdButton = document.querySelector('.buttons > button:last-child');
    this._playerScores = document.querySelectorAll('.game__play');
    this._player = document.querySelectorAll('.game__players > .player');
    this._newGameButton = document.querySelector('.game__start > .btn');
    this._activePlayer = 0;
    this._endGameMark = 100;
    this._activePlayerMark = this._player[this._activePlayer].querySelector(
      '.player__active'
    );
    this._dices = {
      'dice-1.png': 1,
      'dice-2.png': 2,
      'dice-3.png': 3,
      'dice-4.png': 4,
      'dice-5.png': 5,
      'dice-6.png': 6
    };
  }

  _getSuccessMessage() {
    return `Congratulations Player: ${this._activePlayer + 1}, you won!`;
  }

  _getBadDiceMessage() {
    return 'There is a dice with total number of one in your draw dice. Next player will attempt now...';
  }

  _changeGameState() {
    this._gameState === 'active'
      ? (this._gameState = 'notactive')
      : (this._gameState = 'active');
  }

  _getRandom(rangeStart, rangeEnd) {
    return Math.floor(Math.random() * rangeEnd + rangeStart);
  }

  _getRandomDiceImageSrc(randomNumber) {
    return `./img/dice-${randomNumber}.png`;
  }

  _getRandomDicePath() {
    const randDiceNumber = this._getRandom(1, 6);
    return [this._getRandomDiceImageSrc(randDiceNumber), randDiceNumber];
  }

  _getDiceImgLiteral() {
    const [path, number] = this._getRandomDicePath();
    return this._checkDice(number)
      ? `<img alt="dice" class="dices__img" src="${path}" data-dice-value="${number}"/>`
      : false;
  }

  _checkDice(diceNumber) {
    if (diceNumber === 1) {
      return false;
    } else {
      return true;
    }
  }

  _createDiceLiterals(n) {
    let result = '';
    for (let i = 1; i <= n; i++) {
      let literal = this._getDiceImgLiteral();
      if (!literal) {
        return false;
      } else {
        result += literal;
      }
    }
    return result;
  }

  _getDicesSum() {
    const dices = [...this._dicesImg.querySelectorAll('.dices__img')];
    return dices.reduce((acc, item) => acc + Number(item.dataset.diceValue), 0);
  }

  _getPlayerMatrix() {
    // return array with active player on index 0 and not active on index 1
    let playerMatrix = [0, 1];
    if (this._activePlayer) {
      playerMatrix = [1, 0];
      this._setActivePlayer();
    } else {
      this._setActivePlayer();
    }
    return playerMatrix;
  }

  _setActivePlayer() {
    this._activePlayer ? (this._activePlayer = 0) : (this._activePlayer = 1);
  }

  clearOverallScores() {
    const overallScores = document.querySelectorAll('.score');
    overallScores.forEach(score => (score.textContent = 0));
  }

  clearCurrentScores() {
    const currentResults = document.querySelectorAll('.result__text');
    currentResults.forEach(current => (current.textContent = 0));
  }

  hideDices() {
    this._dicesImg.classList.add('img--hidden');
  }

  showDices() {
    this._dicesImg.classList.remove('img--hidden');
  }

  _addDices() {
    const diceLiterals = this._createDiceLiterals(2);
    if (!diceLiterals) {
      this.nextPlayer(true);
      return false;
    } else {
      this._dicesImg.innerHTML = diceLiterals;
      return true;
    }
  }

  removeActivePlayerMark(player) {
    this._player[player].removeChild(this._activePlayerMark);
  }

  addActivePlayerMark(player) {
    this._player[player].appendChild(this._activePlayerMark);
  }

  updateBackgroundActivePlayer() {
    this._game.classList.toggle('background--right');
  }

  resetBackground() {
    this._game.classList.remove('background--right');
  }

  setBoldFontActivePlayer(player) {
    const playerOverallScore = this._playerScores[0].querySelectorAll('.score');
    this._player[player].children[0].classList.toggle('light--text');
    playerOverallScore[player].classList.toggle('light--text');
  }

  setLightFontLastPlayer(player) {
    const playerOverallScore = this._playerScores[0].querySelectorAll('.score');
    this._player[player].children[0].classList.toggle('light--text');
    playerOverallScore[player].classList.toggle('light--text');
  }

  updateCurrentResultActivePlayer() {
    const playerCurrentResultElem = this._currentScore[this._activePlayer]
      .children[1];
    playerCurrentResultElem.textContent =
      Number(playerCurrentResultElem.textContent) + this._getDicesSum();
  }

  clearCurrentResultOfLastPlayer() {
    const playerCurrentResultElem = this._currentScore[this._activePlayer]
      .children[1];
    const lastKnownScore = playerCurrentResultElem.textContent;
    playerCurrentResultElem.textContent = 0;
    return lastKnownScore;
  }

  updateOverallResults(lastKnownCurrentResult) {
    const playerOverallScore = this._playerScores[0].querySelectorAll('.score');
    const score =
      Number(playerOverallScore[this._activePlayer].textContent) +
      Number(lastKnownCurrentResult);
    playerOverallScore[this._activePlayer].textContent = score;
    return score;
  }

  _renderModal(msg) {
    this._changeModalMessage(msg);
    this._addCloseEventToModal();
    this._changeGameState();
    this._showModal();
  }

  _changeModalMessage(msg) {
    const modal = document.querySelector('.modal');
    const modalMessage = modal.querySelector('.modal__msg');
    modalMessage.textContent = msg;
  }

  _addCloseEventToModal() {
    const modal = document.querySelector('.modal');
    const modalClose = modal.querySelector('.modal__btn');
    modalClose.addEventListener('click', this._hideModal);
  }

  _showModal() {
    const modal = document.querySelector('.modal');
    this._changeGameState();
    modal.classList.add('show--modal');
  }

  _hideModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('show--modal');
  }

  updateVisualsOnPlayerSwitch() {
    const [activePlayer, nextPlayer] = this._getPlayerMatrix();
    this.removeActivePlayerMark(activePlayer);
    this.addActivePlayerMark(nextPlayer);
    this.updateBackgroundActivePlayer();
    this.setBoldFontActivePlayer(activePlayer);
    this.setLightFontLastPlayer(nextPlayer);
    this.hideDices();
  }

  rollDice() {
    if (this._addDices() && this._gameState === 'active') {
      this.showDices();
      this.updateCurrentResultActivePlayer();
    } else {
      this._renderModal(this._getBadDiceMessage());
    }
  }

  nextPlayer(diceFault) {
    if (this._gameState === 'active') {
      const lastKnownCurrentResult = this.clearCurrentResultOfLastPlayer();
      let score = 0;
      if (diceFault) {
        this.updateVisualsOnPlayerSwitch();
        return;
      } else {
        score = this.updateOverallResults(lastKnownCurrentResult);
        if (score >= this._endGameMark) {
          this._renderModal(this._getSuccessMessage());
          this.newGame();
          return;
        } else {
          this.updateVisualsOnPlayerSwitch();
        }
      }
    }
  }

  newGame() {
    if (this._gameState === 'active') {
      const lastActivePlayer = this._activePlayer;
      this._activePlayer = 0;
      this.resetBackground();
      this.removeActivePlayerMark(lastActivePlayer);
      this.addActivePlayerMark(0);
      this.setBoldFontActivePlayer(this._activePlayer);
      this.setLightFontLastPlayer(lastActivePlayer);
      this.clearOverallScores();
      this.clearCurrentScores();
      this.hideDices();
    }
  }

  attachMainEvents() {
    this._rollButton.addEventListener('click', this.rollDice.bind(this));
    this._holdButton.addEventListener(
      'click',
      this.nextPlayer.bind(this, false)
    );
    this._newGameButton.addEventListener('click', this.newGame.bind(this));
  }
}

const newGame = new Game();
newGame.attachMainEvents();
