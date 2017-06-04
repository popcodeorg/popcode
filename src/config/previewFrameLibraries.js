/* eslint-disable import/extensions */

import SWEETALERT_JS from
  '../../bower_components/sweetalert/dist/sweetalert.min.js';
import SWEETALERT_CSS from
  '../../bower_components/sweetalert/dist/sweetalert.css';

console.debug(SWEETALERT_JS);

const previewFrameLibraries = {
  sweetalert: {
    name: 'sweetalert',
    javascript: SWEETALERT_JS,
    css: SWEETALERT_CSS,
  },
};

export default previewFrameLibraries;
