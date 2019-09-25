import 'core-js';
import 'regenerator-runtime/runtime';

import handleErrors from './previewSupport/handleErrors';
import handleConsoleExpressions from './previewSupport/handleConsoleExpressions';
import handleConsoleLogs from './previewSupport/handleConsoleLogs';
import overrideAlert from './previewSupport/overrideAlert';

handleErrors();
handleConsoleExpressions();
handleConsoleLogs();
overrideAlert();
