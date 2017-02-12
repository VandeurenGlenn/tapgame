'use strict';
import CustomButton from './custom-button.js';
class CustomNavigationItem extends CustomButton {
  static get is() { return 'custom-navigation-item'; }
  // attributes to observe
  static get observedAttributes() {
    return ['route', 'hashbang'];
  }
  constructor() {
    super();
    // construct template
    // @template
    // bind methods
    this._tap = this._tap.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tap', this._tap);
  }
  set route(value) {
    this._route = value;
  }
  set hashbang(value) {
    this._hashbang = value;
  }
  get hashbang() {
    return this._hashbang || false;
  }
  get route() {
    return this._route || '';
  }
  _bangHash(hash) {
    return `!/${hash}`;
  }
  _tap(event) {
    event.preventDefault();
    const route = this.route;
    if (this.hashbang) {
      location.hash = this._bangHash(route);
    } else {
      location.href = `${location.origin}/${route}`;
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue !== "") {
      this[name] = newValue;
    } else if (newValue === "") {
      this[name] = this.hasAttribute(name);
    }
  }
}
 customElements.define(CustomNavigationItem.is, CustomNavigationItem);
