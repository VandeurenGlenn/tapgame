'use strict';
import PubSubLoader from './../internals/pub-sub-loader.js';
const config = {
  apiKey: "AIzaSyDxwMmGWtZNsnUJiYq73PTyL2A99eVS5CA",
  databaseURL: "https://tapgame-158121.firebaseio.com",
  authDomain: "tapgame-158121.firebaseapp.com"
}
export default class FirebaseController extends HTMLElement {
  constructor() {
    super();
    PubSubLoader();
  }
  connectedCallback() {
    try {
      this.initApp(config.firebase);
    } catch (e) {
      let promises = [
        this._importScript('bower_components/firebase/firebase-app.js'),
        this._importScript('bower_components/firebase/firebase-auth.js'),
        this._importScript('bower_components/firebase/firebase-database.js')
      ]

      Promise.all(promises).then(() => {
        // Initialize Firebase onload
        this.initApp(config);
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
    PubSub.publish('firebase.ready', true);
  }
}
customElements.define('firebase-controller', FirebaseController);
