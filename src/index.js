import './elements/custom-button.js';
import './elements/custom-dialog.js';
import './elements/custom-header.js';
import './elements/custom-pages.js';
import './elements/custom-section.js';
import './elements/custom-container.js';
import './elements/custom-count-down.js';
import './elements/tap-button.js';
import './elements/level-item.js';
import './elements/custom-icons.js';
import './elements/custom-navigation-item.js';
import './elements/game-highscores.js';
import './../bower_components/array-repeat/dist/array-repeat.es.js';
import './../bower_components/custom-template-if/src/custom-template-if.js';
import CustomNotification from './elements/custom-notification.js';
import levels from './sources/levels.json';
import AppController from './controllers/app-controller.js';

export default class TapGame extends AppController {
  constructor() {
    super();
    this._onLoginButtonTap = this._onLoginButtonTap.bind(this);
    this.error = this.error.bind(this);
    this._newUID = this._newUID.bind(this);
    this._locationHashChanged = this._locationHashChanged.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onCountDownMessage = this._onCountDownMessage.bind(this);
    this._onFirebaseReady = this._onFirebaseReady.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    window.onhashchange = this._locationHashChanged;
    if (!window.location.hash) {
      window.location.hash = this._hashbang('home');
    } else {
      this._locationHashChanged({newURL: window.location.hash})
    }
    this._tapButton.addEventListener('tap', this._onClick, {capture: false});
    this._refreshButton.addEventListener('click', this.refresh, {capture: false});
    this._loginButton.addEventListener('tap', this._onLoginButtonTap, {capture: false});
    PubSub.subscribe('firebase.ready', this._onFirebaseReady);
    requestIdleCallback(() => {
      this.querySelector('.__level-list').items = levels;
    });
  }

  disconnectedCallback() {
    this._tapButton.removeEventListener('tap', this._onClick);
    this._refreshButton.removeEventListener('click', this.refresh);
    this._loginButton.removeEventListener('tap', this._onLoginButtonTap);
  }

  set selected(value) {
    this._selected = value;
    this.pages.selected = value;
  }

  set level(value) {
    if (this.player) {
      this.player.level = value;
    }
    this._level = value;
  }

  get _loginButton() {
    return this.querySelector('.login-button');
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

  get level() {
    let level = this._level || 0;
    const player = this.player;
    if (player)
      level = player.level;
    return level;
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

  get _gameDialogHighScores() {
    return this.querySelector('.__dialog-highscores');
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

  get _tapButton() {
    return this.querySelector('tap-button');
  }

  get _notificationElement() {
    const name = 'custom-notification';
    return this.querySelector(name) || this._setupComponent(name);
  }

  get userOnline() {
    return this._userOnline || false;
  }

  get taps() {
    return this._taps || 0;
  }

  get _condensedTitle() {
    return this.querySelector('.__condensed-title');
  }

  set taps(value) {
    this._taps = value;
    this._updateInnerHTML(this._tapCounterElement, value);
  }

  get _refreshButton() {
    return this._gameDialog.querySelector('.__refresh');
  }

  set userOnline(value) {
    if (value) {
      this._updateInnerHTML(this._loginButton, 'sign out');
    } else {
      this._updateInnerHTML(this._loginButton, 'sign in');
    }
    this._userOnline = value;
  }

  _updateInnerHTML(element, value) {
    requestAnimationFrame(() => {
      element.innerHTML = value;
    });
  }

  _setupComponent(name, proto, options={properties: [], attributes: []}) {
    return new Promise(resolve => {
      // TODO: import vanilla or as customElement when supported
      const el = document.createElement(name);
      if (document.querySelector('custom-notification') === null) {
        if ('customElements' in window) {
          customElements.define(name, proto);
        } else {
          document.registerElement(name, proto);
        }
      }
      const target = options.target || this;
      const properties = options.properties;
      const attributes = options.attributes;
      if (properties && properties.length > 0)
        for (let property of properties)
          el[property.name] = property.value;

      if (attributes && attributes.length > 0)
        for (let attribute of attributes)
          el.setAttribute(attribute.name, attribute.value);

      target.appendChild(el);
      resolve(el);
    });
  }

  _toJsProp(string) {
    let parts = string.split('-');
    if (parts.length > 1) {
      var upper = parts[0].charAt(0).toUpperCase();
      u
      upper += parts[1].charAt(0).toUpperCase();
      string = parts[0] + upper + parts[1].slice(1).toLowerCase();
    }
    return string;
  }

  _onLoginButtonTap() {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.auth().signOut().then(() => {
        this.showNotification(this._newUID, 'Signed out!');
        this.user = null;
      }, this.error);
    } else {
      this._googleLogin();
    }
  }

  _newUID() {
    return Math.random().toString(36).slice(-8);
  }

  _googleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    provider.addScope('https://www.googleapis.com/auth/games');
    firebase.auth().signInWithPopup(provider).then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  _onClick(event) {
    event.preventDefault();
    if (event.target.localName === 'tap-button' && this._gameRunning) {
      this.taps += 1;
    }
  }

  _onFirebaseReady() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref('users/' + user.uid).on('value', snapshot => {
          let value = snapshot.val();
          if (value === null) {
            this._addUser(user);
          }
          this.showNotification(
            this._newUID, 'Welcome, ' + user.displayName + '!');
        });
        this.userOnline = true;
      } else {
        this.userOnline = false;
      }
      this.user = user;
      PubSub.publish('player.progress', true);
    });
  }

  _addUser(user) {
    firebase.database().ref('users/' + user.uid).set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL

    })
    console.log(user);
  }

  _selectLevel(event) {

  }

  showNotification(uid, text) {
    this._setupComponent('custom-notification', CustomNotification, {
      properties: [
        {name: 'innerHTML', value: text},
        {name: 'uid', value: uid}
      ]
    }).then(component => {
      component.show();
    });
  }

  loadLevel(level) {
    this.level = level;
    this._hideToolbar();
    this.taps = 0;
    PubSub.publish('level.change', levels[level]);
    this.startCountDown();
  }

  _gameHash() {
    const hash = this._hashbang('play/level-' + this.level);
    location.hash = hash;
  }

  _beforeNavigation() {
    this._updateInnerHTML(this._condensedTitle, null);
    this.taps = null;
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

  _locationHashChanged(change) {
    let parts = change.newURL.split('#');
    this._beforeNavigation();
    if (parts[1].includes('play') && !parts[1].includes('level')) {
      this._gameHash();
    } else if (parts[1].includes('level-')) {
      let level;
      parts = parts[1].split('/');
      for (let part of parts) {
        if (part.includes('level')) {
          this.loadLevel(part.split('-')[1]);
        }
      }
      this.selected = 'playfield';
    } else {
      if (parts[1] === 'home') {
        this._showToolbar();
      } else {
        this._hideToolbar();
        this._updateInnerHTML(this._condensedTitle, parts[1].replace('!/', ''));
      }
      this.selected = parts[1].replace('!/', '');
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
    this._updateInnerHTML(this._countDownElement, number);
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
          this._updateInnerHTML(this._gameCounterElement, data.value);
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
    this._headerElement.style.transition = 'transform ease-out 300ms';
    this._headerElement.condensed = true;
    this.pages.condensed = true;
  }

  _endGame() {
    this._gameRunning = false;
    const goal = levels[this.level].goal;
    const taps = this.taps;
    const win = () => {
      if (taps === goal || taps > goal) { return true };
      return false;
    }

    if (win()) {
      this._updateInnerHTML(this._gameDialogTitle, 'level complete');
      this._updateInnerHTML(this._gameDialogHighScores, 'Great Job!');
    } else {
      this._updateInnerHTML(this._gameDialogHighScores, 'Better luck next time');
      this._updateInnerHTML(this._gameDialogTitle, 'level failed');
    }
    this._updateInnerHTML(this._gameDialogResult, taps);
    this._updateInnerHTML(this._gameDialogGoal, goal);

    if (this.userOnline) {
      const userHighscoresLocation =
        `users/${this.user.uid}/highscores/${this.level}`;
      const highscoresLocation =
        `highscores/${this.level}`;

      /**
       * read & write highscores
       */
      firebase.database()
        .ref(userHighscoresLocation)
        .once('value', snapshot => {
          let value = snapshot.val();
          if (value === null || value !== null && value < taps) {
            firebase.database().ref(userHighscoresLocation).set(taps);
            firebase.database().ref(highscoresLocation).once('value', snapshot => {
              const holders = snapshot.val();
              if (holders === null)
                firebase.database()
                  .ref(`/${highscoresLocation}/${this.user.uid}`)
                  .set({name: this.user.displayName, score: taps});
              else
                firebase.database()
                  .ref(`/${highscoresLocation}/${this.user.uid}`)
                  .set({name: this.user.displayName, score: taps});
            });
            this.showNotification(this._newUID, 'New Highscore!');
            this._updateInnerHTML(this._gameDialogHighScores, 'New Highscore!');
          }
      })
    } else {
      this._updateInnerHTML(this._gameDialogHighScores, `
      <h3>Submit score</h3>
      <input type="text">
      not supported yet, please login to submit scores.
      `);
    }

    this._gameDialog.opened = true;
  }

  error(error) {
    console.error(error);
  }

  refresh() {
    if (this._gameDialog.opened) {
      this._gameDialog.opened = false;
    }
    this._locationHashChanged({newURL: window.location.hash});
  }
  // TODO: import pages (shards) when idle
}
customElements.define('tap-game', TapGame);
