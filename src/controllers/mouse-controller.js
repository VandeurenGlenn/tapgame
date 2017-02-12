'use strict';
export default class MouseController extends HTMLElement {
  static get is() { return 'mouse-controller'; }
    constructor() {
      super();
      this._onwheel = this._onwheel.bind(this);
    }
    connectedCallback() {
      window.onwheel = this._onwheel;
    }
    _onwheel(event) {
      const ctrl = event.ctrlKey;
      if (ctrl) {
        event.preventDefault();
      }
    }
}
customElements.define(MouseController.is, MouseController)
