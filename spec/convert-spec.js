'use babel';

/* globals expect */
/* eslint-disable no-template-curly-in-string */

import S from 'sanctuary';
import convert from '../lib/convertToTemplate';

describe('convert when passed an empty string', () => {
  it('should return an empty string', () => {
    expect(convert('')).toEqual(S.Nothing());
  });

  it('should convert a concatenated string', () => {
    const str = "'this ' + a + ' is the answer';";
    expect(convert(str))
      .toEqual(S.Just('`this ${a} is the answer`;'));
  });
});
