'use strict';
 class CustomCountDown extends HTMLElement {
   static get is() { return 'custom-count-down'; }
   static get observedAttributes() {
     return ['counting'];
   }
   constructor() {
     super();
     this.root = this.attachShadow({mode: 'open'});
     // @template
   }
   attributeChangedCallback(name, oldValue, newValue) {
     if (oldValue !== newValue) {
       this[name] = newValue;
     }
   }
   set counting(value) {
     if (value)
       this.classList.add('counting');
     else
       this.classList.remove('counting');
   }
}
 customElements.define(CustomCountDown.is, CustomCountDown)
