'use strict';
class CustomSection extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
  connectedCallback() {
    this.setAttribute('resolved', '');
  }
}
customElements.define('custom-section', CustomSection);
