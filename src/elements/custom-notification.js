'use strict';
export default class CustomNotification extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
  show() {
    this.classList.add('show');
    setTimeout(() => {
      this.classList.remove('show');
    }, 5000);
  }
}
