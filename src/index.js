import './elements/custom-button.js';
import './elements/custom-dialog.js';
import './elements/custom-header.js';
import './elements/custom-pages.js';
import './elements/custom-section.js';
import './elements/custom-container.js';
import './elements/custom-count-down.js';
import './elements/tap-button.js';
import './elements/custom-icons.js';
import PubSubLoader from './internals/pub-sub-loader.js';
import levels from './sources/levels.json';
export default class TapGame extends HTMLElement {
  constructor() {
    super();
    // this._onLoginButtonTap = this._onLoginButtonTap.bind(this);
    this._locationHashChanged = this._locationHashChanged.bind(this);
    this._startGame = this._startGame.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onCountDownMessage = this._onCountDownMessage.bind(this);

    PubSubLoader();
  }
  connectedCallback() {
    // if (!this.user) {
      // document.querySelector('.login-button').addEventListener('tap', this._onLoginButtonTap);
    // }
    window.onhashchange = this._locationHashChanged;
    if (!window.location.hash) {
      window.location.hash = 'home'
    } else {
      this._locationHashChanged({newURL: window.location.hash})
    }
    this._startButton.addEventListener('click', this._startGame);
    this.addEventListener('click', this._onClick);
  }

  get _startButton() {
    return this.querySelector('.start');
  }

  get selected() {
    return this._selected || 'home';
  }

  get pages() {
    return this.querySelector('custom-pages');
  }

  set selected(value) {
    this._selected = value;
    this.pages.selected = value;
  }

  get level() {
    return this.player ? this.player.level : 0;
  }

  get _loginDialog() {
    return this.querySelector('.login-dialog');
  }

  get _gameDialog() {
    return this.querySelector('.game-dialog');
  }

  get _gameDialogTitle() {
    return this._gameDialog.querySelector('.title');
  }

  get _gameDialogResult() {
    return this._gameDialog.querySelector('.result');
  }

  get _gameDialogGoal() {
    return this._gameDialog.querySelector('.goal');
  }

  get _countDownElement() {
    return this.querySelector('custom-count-down');
  }

  get _gameCounterElement() {
    return this.querySelector('.game-counter')
  }

  get _tapCounterElement() {
    return this.querySelector('.tap-counter')
  }

  get _headerElement() {
    return this.querySelector('custom-header');
  }

  get taps() {
    return this._taps || 0;
  }

  set taps(value) {
    this._taps = value;
    this._tapCounterElement.innerHTML = value;
  }

  _onLoginButtonTap() {
    console.log('ta');
    this._loginDialog.opened = !this._loginDialog.opened;
  }

  _onClick(event) {
    if (event.target.localName === 'tap-button' && this._gameRunning) {
      this.taps += 1;
    }
  }

  _startGame() {
    // this.resetCounter();
    const hash = '#level-' + this.level;
    location.hash = hash;
  }

  _selectLevel(event) {

  }

  loadLevel(level) {
    PubSub.publish('level.change', level);
    this.startCountDown();
  }

  _locationHashChanged(change) {
    let parts = change.newURL.split('#');
    if (parts[1].includes('level')) {
      parts = parts[1].split('-');
      const level = parts[1];
      this.selected = 'playfield';
      this.taps = 0;
      this.loadLevel(levels[level]);
      this._hideToolbar();
    } else {
      this.selected = parts[1];
      this._showToolbar();
      this.taps = 0;
      if (this._countDownWorker) {
        this._countDownWorker.terminate();
        this._countDownElement.counting = false;
        this._countDownWorker = undefined;
      }
      if (this._gameWorker) {
        this._gameWorker.terminate();
        this._gameWorker = undefined;
      }
    }
  }

  startCountDown() {
    if (typeof(this._countDownWorker) === 'undefined') {
      this._countDownWorker = new Worker('workers/count-down.js');
    }
    this._countDownElement.counting = true;
    this._countDownWorker.onmessage = this._onCountDownMessage;
  }

  _onCountDownMessage(message) {
    let number = message.data.value;
    this._countDownElement.innerHTML = number;
    if (number === 0) {
      this._countDownWorker.terminate();
      this._countDownElement.counting = false;
      this._countDownWorker = undefined;
      this._gameRunning = true;
      this._startGameTimer(levels[this.level].time);
    }
  }

  _startGameTimer(time) {
    if (typeof(this._gameWorker) === 'undefined') {
      this._gameWorker = new Worker('workers/game.js');
    }
    this._gameWorker.addEventListener('message', message => {
      const data = message.data;
      switch (data.type) {
        case 'stopped':
          this._gameWorker.terminate();
          this._gameWorker = undefined;
          this._endGame();
          break;
        case 'count':
          this._gameCounterElement.innerHTML = data.value;
          break;
      }
    })
    this._gameWorker.postMessage({type: 'start', time: time})

  }

  _showToolbar() {
    this._headerElement.style.transform = 'translateY(0)';
    this._headerElement.style.transition = 'transform ease-in 300ms';
    this._headerElement.condensed = false;
    this.pages.condensed = false;
  }

  _hideToolbar() {
    // this._headerElement.style.transform = 'translateY(-100%)';
    this._headerElement.style.transition = 'transform ease-out 300ms';
    this._headerElement.condensed = true;
    this.pages.condensed = true;
  }

  _endGame() {
    this._gameRunning = false;
    const goal = levels[this.level].goal;
    if (this.taps === goal || this.taps > goal) {
      this._gameDialogTitle.innerHTML = 'level complete';
    } else {
      this._gameDialogTitle.innerHTML = 'level failed';
    }
    this._gameDialogResult.innerHTML = this.taps;
    this._gameDialogGoal.innerHTML = goal;
    this._gameDialog.opened = true;
  }
  // TODO: import pages (shards) when idle
}
customElements.define('tap-game', TapGame);
