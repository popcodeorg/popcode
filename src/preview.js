import handleErrors from './previewSupport/handleErrors';
import handleConsoleExpressions
  from './previewSupport/handleConsoleExpressions';
import overrideAlert from './previewSupport/overrideAlert';

handleErrors();
handleConsoleExpressions();
overrideAlert();
