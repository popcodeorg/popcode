import Immutable from 'immutable';

const sampleError = {reason: 'bad-code'};

export const user = {
  initial: Immutable.fromJS({authenticated: false}),
};

export const projects = {
  initial: new Immutable.Map(),
};

export const errors = {
  noErrors: Immutable.fromJS({
    html: {items: [], state: 'passed'},
    css: {items: [], state: 'passed'},
    javascript: {items: [], state: 'passed'},
  }),

  errors: Immutable.fromJS({
    html: {items: [], state: 'passed'},
    css: {items: [sampleError], state: 'failed'},
    javascript: {items: [], state: 'passed'},
  }),

  validating: Immutable.fromJS({
    html: {items: [], state: 'validating'},
    css: {items: [], state: 'validating'},
    javascript: {items: [], state: 'validating'},
  }),
};
