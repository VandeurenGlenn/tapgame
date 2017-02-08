'use strict';
class CustomContainer extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
  connectedCallback() {
    this.setAttribute('resolved', '');
  }
}
customElements.define('custom-container', CustomContainer);
