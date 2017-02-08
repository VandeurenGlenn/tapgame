'use strict';
suite('custom-header', function() {
  const CustomHeader = document.createElement('custom-header');
  test('is not condensed', function() {
    assert.isFalse(CustomHeader.condensed);
  });
});
