'use strict';
let number = 3;
postMessage({value: number});
const interval = setInterval(() => {
  number -= 1;
  postMessage({value: number});
}, 1000);
interval;
