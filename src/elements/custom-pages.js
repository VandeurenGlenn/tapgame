'use strict';
export default class CustomPages extends HTMLElement {
  static get observedAttributes() {
    return ['selected', 'animations'];
  }
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
  attributeChangeCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }
  get animations() {
    let animations;
    if (this.hasAttribute('animations')) {
      try {
        animations = JSON.parse(this.getAttribute('animations'));
      } catch (e) {
        animations = {};
      }
    }
    return animations || this._animations;
  }
  get attrForSelected() {
    return this.getAttribute('attr-for-selected') || 'name'
  }
  get _previousSelectedQuery() {
    return `*[${this.attrForSelected}="${this.previousSelected}"]`;
  }
  set animations(value) {
    this._animations = value;
  }
  set condensed(value) {
    if (value)
      this.classList.add('condensed');
    else
      this.classList.remove('condensed');
  }
  set selected(value) {
    if (this.previousSelected) {
      const el = this.querySelector(this._previousSelectedQuery);
      this.animate(this.previousSelected, 'out').then(() => {
        requestAnimationFrame(() => {
          el.classList.remove('custom-selected');
        });
      });
    }
    this.animate(value).then(() => {
      requestAnimationFrame(() => {
        this.querySelector(`*[${this.attrForSelected}="${value}"]`)
          .classList.add('custom-selected');
      });
    });

    this.previousSelected = value;
  }

  animate(name, out=false) {
    return new Promise((resolve, reject) => {
      const animation = this.animations[name];
      if (animation) {
        let el = this.querySelector(`*[${this.attrForSelected}="${name}"]`);
        el.style.willChange = 'transform';
        if (out) {
          requestAnimationFrame(() => {
            el.style.transform = animation.out;
            el.style.transition =
            `transform ease-out ${animation['transition-delay'] || 0}ms`;
          });
        } else {
          requestAnimationFrame(() => {
            el.style.transform = animation.in;
            el.style.transition =
            `transform ease-out ${animation['transition-delay'] || 0}ms`;
          });
        }
        setTimeout(() => {
          requestAnimationFrame(() => {
            el.style.transform = 'translateY(0)';
          });
          resolve();
        }, animation.delay);
      } else
        resolve();
    });
  }

  isAnimated(name) {
    if (this.animations[name]) return true;
  }
}
customElements.define('custom-pages', CustomPages);
