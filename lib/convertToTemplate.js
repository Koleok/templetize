'use babel';

import R from 'ramda';
import S from 'sanctuary';
import $ from 'sanctuary-def';
import { mapped } from 'ramda-lens';
import { def } from './sanctuary/def';
import { a } from './sanctuary/types';

const tick = '`';
const strToStr = [$.String, $.String];
const trimap = R.compose(mapped, mapped, mapped);

const updateWith =
  def('updateWith', [a, $.Integer, $.Array(a), $.Array(a)], R.flip(R.update));

const replace =
  def('replace', [$.String, $.String, $.String, $.String], R.useWith(
    R.replace,
    [R.compose(S.regex('g'), S.regexEscape), S.I]
  ));

const openTemplate =
  def('openTemplate', strToStr, replace("' + ", '${'));

const closeTemplate =
  def('closeTemplate', strToStr, replace(" + '", '}'));

const firstTick =
  def('firstTick', [$.String, $.String], R.update(0, tick));

const updateLastTick =
  def('updateLastTick', [$.Array($.String), $.Function],
    R.compose(updateWith(tick), R.lastIndexOf("'"))
  );

const lastTick =
  def('lastTick', [$.String, $.String], R.converge(R.call, [updateLastTick, S.I]));

const backticks =
  def('backticks', [$.String, $.String], R.compose(R.join(''), lastTick, firstTick));

const convert =
  def('convert', [$.String, $.String], R.compose(backticks, openTemplate, closeTemplate));

const findConcats =
  def('findConcats', [$.String, S.MaybeType($.Array(S.MaybeType($.String)))], S.match(/'.*'\s\+\s.*;/g));

const makeReplacer =
  def('makeReplacer', [$.String, $.Function([$.String, $.String])], R.converge(
    R.replace,
    [S.I, convert]
  ));

const makeReplacers =
  def('makeReplacers', [$.String, S.MaybeType($.Function([$.String, $.String]))], R.compose(
    R.map(S.pipe),
    R.chain(R.sequence(S.Just)),
    R.over(trimap, makeReplacer),
    findConcats
  ));

export default def('convertToTemplate', [$.String, S.MaybeType($.String)], R.converge(R.ap, [
  makeReplacers,
  S.Just,
]));
