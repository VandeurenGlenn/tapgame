'use strict';
import CustomButton from './custom-button.js';
import PubSubLoader from './../internals/pub-sub-loader.js';

export default class TapButton extends CustomButton {
  constructor() {
    super();
     let style = document.createElement('style');
     style.innerHTML = `:host {
       --custom-button-width: var(--tap-button-width, 48px);
       --custom-button-min-width: var(--tap-button-min-width, 0);
       --custom-button-height: var(--tap-button-height, 48px);
       --custom-button-border-radius: var(--tap-button-border-radius, 3px);
       --custom-button-background: var(--tap-button-background, rgb(184, 26, 101));
     }`
     this.root.appendChild(style);
     this._onLevelChange = this._onLevelChange.bind(this);

     PubSubLoader();
  }
  connectedCallback() {
    super.connectedCallback();
    PubSub.subscribe('level.change', this._onLevelChange);
  }
  _onLevelChange(change) {
    const tapSize = change.tapSize;
    this.style.setProperty('--tap-button-width', `${tapSize}px`);
    this.style.setProperty('--tap-button-height', `${tapSize}px`);
    if (tapSize < 50) {
      this.style.setProperty('--tap-button-border-radius', '50%');
    }
  }
}
customElements.define('tap-button', TapButton);
