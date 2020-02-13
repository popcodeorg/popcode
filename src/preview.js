import 'core-js';
import 'regenerator-runtime/runtime';

import handleConsoleExpressions from './previewSupport/handleConsoleExpressions';
import handleConsoleLogs from './previewSupport/handleConsoleLogs';
import handleErrors from './previewSupport/handleErrors';
import handleKeyEvents from './previewSupport/handleKeyEvents';
import overrideAlert from './previewSupport/overrideAlert';

handleErrors();
handleConsoleExpressions();
handleConsoleLogs();
handleKeyEvents();
overrideAlert();
