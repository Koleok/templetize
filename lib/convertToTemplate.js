'use babel';

import R from 'ramda';
import S from 'sanctuary';
import $ from 'sanctuary-def';
import { def } from './sanctuary/def';

const tick = '`';

const replace = def('replace', [$.String, $.String, $.String],
  R.useWith(R.replace, [R.compose(S.regex('g'), S.regexEscape), S.I])
);

const strSig = [$.String, $.String];
const openTemplate = def('openTemplate', strSig, replace("' + ", '${'));
const closeTemplate = def('closeTemplate', strSig, replace(" + '", '}'));
const lastIndex = def('lastIndex', [$.String, $.Integer], R.compose(S.dec, R.length));
const firstTick = def('firstTick', strSig, R.update(0, tick));
const updateLastTick = def('updateLastTick', strSig, R.compose(R.update(R.__, tick), lastIndex));
const lastTick = def('lastTick', strSig, R.converge(R.call, [updateLastTick, S.I]));
const backticks = def('backticks', strSig, R.compose(
  R.join(''),
  lastTick,
  firstTick
));

export default def('convert', [$.String, $.String], R.compose(
  S.fromMaybe(''),
  R.map(backticks),
  R.map(openTemplate),
  R.map(closeTemplate),
  S.toMaybe
));
