'use babel';

/* globals expect */
/* eslint-disable no-template-curly-in-string */

import convert from '../lib/convertToTemplate';

describe('convert when passed an empty string', () => {
  it('should return an empty string', () => {
    expect(convert('')).toEqual('');
  });

  it('should convert a concatenated string', () => {
    expect(convert("'this ' + a + ' is the answer'"))
      .toEqual('`this ${a} is the answer`');
  });
});
