import * as stringUtil from './string';
import * as arrayUtil from './array';
import * as objectUtil from './object';
import * as crypt from './crypt';
import { Unique } from './unique';
import { URL } from './url';

export default {
  ...stringUtil,
  ...arrayUtil,
  ...objectUtil,
  ...crypt,
  Unique,
  URL
}