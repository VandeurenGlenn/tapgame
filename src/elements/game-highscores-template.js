'use strict';
export default class GameHighscoresTemplate extends HTMLElement {
  static get is() { return 'game-highscores-template'; }
  // attributes to observe
  static get observedAttributes() { return []; }
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
  set title(value) {
    this.root.querySelector('.title').innerHTML = value;
    this._title = value;
  }
  get title() {
    return this._title;
  }
  get _repeatElement() {
    return this.root.querySelector('array-repeat');
  }
  set items(value) {
    this._repeatElement.items = value;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }
}
customElements.define(GameHighscoresTemplate.is, GameHighscoresTemplate)
