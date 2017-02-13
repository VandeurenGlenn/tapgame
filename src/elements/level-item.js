'use strict';
class LevelItem extends HTMLElement {
  static get is() { return 'level-item'; }
  // attributes to observe
  static get observedAttributes() { return ['level', 'data-index']; }
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // inject template on build
    // @template
    // bind methods
    this._click = this._click.bind(this);
  }
  connectedCallback() {
    this.addEventListener('click', this._click);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._click);
  }
  set dataIndex(value) {
    this.innerHTML = (Number(value) + 1);
    this._dataIndex = value;
  }
  get dataIndex() {
    return this._dataIndex;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue)
      if (name === 'data-index')
        this.dataIndex = newValue;
      else
        this[name] = newValue;
  }
  _click(event) {
    event.preventDefault();
    if (this.hasAttribute('locked')) {
      return;
    }
    location.hash = `!/play/level-${this.dataIndex}`;
  }
}
customElements.define(LevelItem.is, LevelItem)
