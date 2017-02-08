'use strict';
import config from './../trendystore.config.js';
import PubSubLoader from './../internals/pub-sub-loader.js';

export default class FirebaseController extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    PubSubLoader();
    try {
      this.initApp(config.firebase);
    } catch (e) {
      let promises = [this._importScript('bower_components/firebase/firebase-app.js'),
      this._importScript('bower_components/firebase/firebase-auth.js'),
      this._importScript('bower_components/firebase/firebase-database.js')];

      Promise.all(promises).then(() => {
        // Initialize Firebase onload
        this.initApp(config.firebase);
        PubSub.publish('firebase.ready', true);
      });
    }
  }
  _importScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.setAttribute('async', '');
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      };
      this.appendChild(script);
    });
  }
  initApp(config) {
    firebase.initializeApp(config);
  }
}
customElements.define('firebase-controller', FirebaseController);
