'use strict';
export default class CustomButton extends HTMLElement {
   static get observedAttributes() { return ['name', 'title'] }
   constructor() {
     super();
     this.root = this.attachShadow({mode: 'open'});
     this._down = this._down.bind(this);
     this._up = this._up.bind(this);
     // @template
   }
	connectedCallback() {
		this.addEventListener('mousedown', this._down, {capture: false});
		this.addEventListener('mouseup', this._up, {capture: false});
	}
	_down(event) {
    event.preventDefault();
    requestAnimationFrame(() => {
    		this.classList.add('pressed');
    });
	}
	_up(event) {
    event.preventDefault();
    requestAnimationFrame(() => {
      this.classList.remove('pressed');
    	this.dispatchEvent(new CustomEvent('tap', {bubbles: false}));
    });
	}
   attributeChangedCallback(name, oldVal, newVal) {
     if (oldVal !== newVal) {
       this[name] = newVal;
     }
   }
   get _button() {
    return this.root.querySelector('button');
   }
   get name() {
     return this._button.getAttribute('name');
   }
   get title() {
     return this._button.getAttribute('title');
   }
   set name(value) {
     this._button.setAttribute('name', value);
   }
   set title(value) {
     this._button.title = value;
   }
}
customElements.define('custom-button', CustomButton);
