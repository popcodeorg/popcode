import fs from 'fs';
import path from 'path';
import base64 from 'base64-js';
import {TextEncoder} from 'text-encoding';

export const spinnerPage = base64.fromByteArray(
  new TextEncoder('utf-8').encode(
    fs.readFileSync(
      path.join(
        __dirname,
        '../templates/github-export.html',
      ),
    ),
  ),
);
