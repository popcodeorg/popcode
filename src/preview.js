import handleErrors from './previewSupport/handleErrors';
import handleConsoleExpressions
  from './previewSupport/handleConsoleExpressions';
import handleConsoleLogs from './previewSupport/handleConsoleLogs';
import overrideAlert from './previewSupport/overrideAlert';
import handleElementHighlights from './previewSupport/handleElementHighlights';

handleErrors();
handleConsoleExpressions();
handleConsoleLogs();
overrideAlert();
handleElementHighlights();

