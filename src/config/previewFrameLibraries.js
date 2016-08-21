import fs from 'fs';
import path from 'path';

const previewFrameLibraries = {
  sweetalert: {
    name: 'sweetalert',
    javascript: fs.readFileSync(
      path.join(__dirname,
        '../../bower_components/sweetalert/dist/sweetalert.min.js'
        )
    ),
    css: fs.readFileSync(
      path.join(__dirname,
        '../../bower_components/sweetalert/dist/sweetalert.css'
        )
      ),
  },

};

export default previewFrameLibraries;
