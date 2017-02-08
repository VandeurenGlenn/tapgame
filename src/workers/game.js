'use strict';
const start = time => {
  setInterval(() => {
    time -= 1;
    postMessage({type: 'count', value: time});
    if (time === 0) {
      postMessage({type: 'stopped'})
    }
  }, 1);
}

addEventListener('message', message => {
  const data = message.data;
  if (data.type === 'start') {
    start(data.time);
  }
});
