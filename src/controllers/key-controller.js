'use strict';
export default class KeyController extends HTMLElement {
  static get is() { return 'key-controller'; }
    constructor() {
      super();
      this._onkeydown = this._onkeydown.bind(this);
    }
    connectedCallback() {
      window.onkeydown = this._onkeydown;
    }
    _onkeydown(event) {
      const key = event.key;
      const ctrl = event.ctrlKey;
      if (ctrl === true)
        if (key === '+' || key === '-')
          event.preventDefault();
    }
}
customElements.define(KeyController.is, KeyController)
