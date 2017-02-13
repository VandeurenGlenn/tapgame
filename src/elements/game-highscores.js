'use strict';
import GameHighscoresTemplate from './game-highscores-template.js';
class GameHighscores extends GameHighscoresTemplate {
  static get is() { return 'game-highscores'; }
  // attributes to observe
  static get observedAttributes() { return []; }
  constructor() {
    super();
    this._onFirebaseReady = this._onFirebaseReady.bind(this);
    PubSub.subscribe('firebase.ready', this._onFirebaseReady);
  }
  connectedCallback() {
    this.classList.add('first-selected');
    this.classList.add('last-selected');
    const buttons = this.root.querySelectorAll('custom-button');
    for (let button of buttons) {
      button.addEventListener('tap', event => {
        this[event.target.name]();
      });
    }
  }
  get selected() {
    return this._selected || 0;
  }
  set selected(value) {
    this._selected = value;
    this._renderScores(this.highscores);
  }
  get _firstRender() {
    return this.__firstRender || true;
  }
  set _firstRender(value) {
    this.__firstRender = value;
  }
  set highscores(value) {
    if (this._needsRender(value, this.highscores)) {
      this._renderScores(value);
    }
    this._highscores = value;
  }
  get highscores() {
    return this._highscores;
  }
  _needsRender(value, isValue) {
    if (value === isValue) {
      return false;
    }
    return true;
  }
  _renderScores(highscores) {
    const level = this.selected;
    this.title = `Level ${level + 1}`;
    if (highscores) {
      this.items = highscores[level];
    }
  }
  _onFirebaseReady() {
    firebase.database().ref('highscores').on('value', snapshot => {
      const highscores = snapshot.val();
      if (highscores) {
        this.highscores = highscores;
        if (highscores.length > 1)
          this.classList.remove('last-selected');
      }
    });
  }
  _computeLastSelected(selected) {
    const length = (this.highscores.length - 1);
      if (length === selected)
        this.classList.add('last-selected');
      else
        this.classList.remove('last-selected');
  }
  _computeFirstSelected(selected) {
    if (selected === 0)
      this.classList.add('first-selected');
    else {
      this.classList.remove('first-selected');
    }
  }
  forward() {
    const length = (this.highscores.length - 1);
    let selected = this.selected;
    if (length > selected) {
      selected += 1;
      this.selected = selected;
    }
    this._computeLastSelected(selected);
    this._computeFirstSelected(selected);
  }
  back() {
    let selected = this.selected;
    if (selected > 0) {
      selected -= 1;
      this.selected = selected;
    }
    this._computeLastSelected(selected);
    this._computeFirstSelected(selected);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }
}
customElements.define(GameHighscores.is, GameHighscores)
