'use strict';
import FirebaseController from './firebase-controller.js';
import KeyController from './key-controller.js';
import MouseController from './mouse-controller.js';
import PubSubLoader from './../internals/pub-sub-loader.js';

export default class AppController extends HTMLElement {
  static get is() { return 'app-controller'; }
  constructor() {
    super();
    PubSubLoader();
  }
  connectedCallback() {
    const firebaseController = new FirebaseController();
    const keyController = new KeyController();
    const mouseController = new MouseController();
    this.appendChild(firebaseController);
    this.appendChild(keyController);
    this.appendChild(mouseController);
  }

  /**
   * HashBang url (adds a ! infront)
   */
  _hashbang(string) {
    return `!/${string}`;
  }
}
customElements.define(AppController.is, AppController);
