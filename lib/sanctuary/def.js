'use babel';

import R from 'ramda';
import _def from './conf';

export const def =
  (name, sig, func, config = {}) => _def(name, config, sig, func);

const defTuple =
  R.compose(R.map, R.apply)(def);

export const defModule =
  R.converge(R.zipObj, [R.pluck(0), defTuple]);
