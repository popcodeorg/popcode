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
  initial: fromJS({
    firebase: {exportingSnapshot: false},
    gists: {lastExport: null},
  }),
  waitingForSnapshot: fromJS({
    firebase: {exportingSnapshot: true},
    gists: {lastExport: null},
  }),
  waitingForGist: fromJS({
    firebase: {exportingSnapshot: false},
    gists: {lastExport: {status: 'waiting'}},
  }),
};
