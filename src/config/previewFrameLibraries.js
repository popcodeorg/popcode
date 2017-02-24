import fs from 'fs';
import path from 'path';

const previewFrameLibraries = {
  loopProtect: {
    name: 'loopProtect',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../node_modules/loop-protect/dist/loop-protect.min.js',
      ),
    ),
  },

  sweetalert: {
    name: 'sweetalert',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/sweetalert/dist/sweetalert.min.js',
      ),
    ),
    css: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/sweetalert/dist/sweetalert.css',
      ),
    ),
  },
};

export default previewFrameLibraries;
