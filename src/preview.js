import handleErrors from './previewSupport/handleErrors';
import handleConsoleExpressions
  from './previewSupport/handleConsoleExpressions';
import handleConsoleLogs from './previewSupport/handleConsoleLogs';
import overrideAlert from './previewSupport/overrideAlert';
import {
  handleTestRuns,
} from './previewSupport/tests';

handleErrors();
handleConsoleExpressions();
handleConsoleLogs();
overrideAlert();
handleTestRuns();
