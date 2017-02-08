'use strict';
import PubSubLoader from './../internals/pub-sub-loader.js';
export default class PouchController extends HTMLElement {
	constructor() {
		super();
    this._onPouchReady = this._onPouchReady.bind(this);
    PubSubLoader();
	}
	/**
	 * @private
	 */
	connectedCallback() {
		this._importPouchdb();
	}
	set pouchReady(value) {
		this._pouchReady = value;
	}

	get pouchReady() {
		return this._pouchReady || false;
	}
	/**
	 * @private
	 */
	_importPouchdb() {
		if (window.PouchDB !== undefined) {
			this.pouchReady = true;
			PubSub.publish('pouchdb.ready', this.pouchReady);
			return;
		}
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/pouchdb/6.1.0/pouchdb.min.js';
		script.setAttribute('async', '');
		script.onload = this._onPouchReady;
		this.appendChild(script);
	}

  _onPouchReady() {
		this.pouchReady = true;
		// TODO: Fork PouchDB & run rollup on it
		PubSub.publish('pouchdb.ready', this.pouchReady);
  }
}
customElements.define('pouch-controller', PouchController);
