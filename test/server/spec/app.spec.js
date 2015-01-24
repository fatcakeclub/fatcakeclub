'use strict';

var app = require('../../../app');

describe('app', function() {
  // beforeEach(function() {

  // });
  it('listen is defined', function() {
    expect(app.listen).toBeDefined('app.listen is undefined');
  });
});