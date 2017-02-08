'use strict';
export default class CustomDialog extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    this.close = this.close.bind(this);
    // @template
  }
  connectedCallback() {
    this.root.querySelector('.backdrop').addEventListener('click', this.close);
  }
  set opened(value) {
    this._opened = value;
    if (value) {
      this.classList.add('opened');
    } else {
      this.classList.remove('opened');
    }
  }
  get opened() {
    return this._opened || false;
  }
  close() {
    this.opened = false;
  }
}
customElements.define('custom-dialog', CustomDialog);
