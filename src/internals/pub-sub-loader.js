'use strict';
import PubSub from './pub-sub.js';

export default () => {
  window.PubSub = window.PubSub || new PubSub();
}
