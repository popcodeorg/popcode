import {List, Map, fromJS} from 'immutable';
import {Error, ErrorList, ErrorReport} from '../../src/records';

const sampleError = new Error({reason: 'bad-code'});
const validatingErrorList = new ErrorList({state: 'validating'});

export const user = {
  initial: fromJS({authenticated: false}),
};

export const projects = {
  initial: new Map(),
};

export const errors = {
  noErrors: new ErrorReport(),

  errors: new ErrorReport().set(
    'css',
    new ErrorList({items: new List([sampleError]), state: 'validation-error'}),
  ),

  validating: new ErrorReport({
    html: validatingErrorList,
    css: validatingErrorList,
    javascript: validatingErrorList,
  }),
};

export const clients = {
  initial: fromJS({gists: {lastExport: null}}),
  waiting: fromJS({gists: {lastExport: {status: 'waiting'}}}),
};
