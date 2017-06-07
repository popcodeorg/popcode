import base64 from 'base64-js';
import {TextEncoder} from 'text-encoding';
import spinnerPageHtml from '../templates/github-export.html';

export const spinnerPage = base64.fromByteArray(
  new TextEncoder('utf-8').encode(spinnerPageHtml),
);
