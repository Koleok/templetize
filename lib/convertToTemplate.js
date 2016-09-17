'use babel';

import R from 'ramda';
import S from 'sanctuary';
import $ from 'sanctuary-def';
import { def } from './sanctuary/def';

const tick = '`';
const strToStr = [$.String, $.String];

const replace = def('replace', [$.String, $.String, $.String, $.String],
  R.useWith(R.replace, [R.compose(S.regex('g'), S.regexEscape), S.I])
);

const openTemplate =
  def('openTemplate', strToStr, replace("' + ", '${'));

const closeTemplate =
  def('closeTemplate', strToStr, replace(" + '", '}'));

const firstTick =
  def('firstTick', [$.String, $.String], R.compose(
    R.join(''),
    R.update(0, tick),
    R.split('')
  ));

const lastIndex =
  def('lastIndex', [$.Array($.String), $.Integer], R.compose(
    S.dec,
    R.length
  ));

const updateLastTick =
  def('updateLastTick', [$.Array($.String), $.Function], R.compose(
    R.update(R.__, tick),
    lastIndex
  ));

const lastTick =
  def('lastTick', [$.String, $.String], R.compose(
    R.join(''),
    R.converge(R.call, [updateLastTick, S.I]),
    R.split('')
  ));

export default def('convert', [$.String, $.String], R.compose(
  S.fromMaybe(''),
  R.map(lastTick),
  R.map(firstTick),
  R.map(openTemplate),
  R.map(closeTemplate),
  S.toMaybe
));
