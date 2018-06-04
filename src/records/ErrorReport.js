import {Record} from 'immutable';

import ErrorList from './ErrorList';

const defaultErrorList = new ErrorList();

export default Record({
  html: defaultErrorList,
  css: defaultErrorList,
  javascript: defaultErrorList,
}, 'ErrorReport');
