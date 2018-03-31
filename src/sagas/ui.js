import {all, call, put, select, take, takeEvery} from 'redux-saga/effects';
import {debounceFor} from 'redux-saga-debounce-effect';
import {
  userDoneTyping as userDoneTypingAction,
  dateInputUpdated,
  parsedDateUpdated,
} from '../actions/ui';
import {getCurrentProject} from '../selectors';
import {
  projectExportDisplayed,
  projectExportNotDisplayed,
} from '../actions/clients';
import {
  assignmentDisplayed,
  assignmentSubmissionDisplayed,
  assignmentUpdateDisplayed,
} from '../actions/assignments';
import {openWindowWithContent} from '../util';
import spinnerPageHtml from '../../templates/project-export.html';
import compileProject from '../util/compileProject';
import chrono from 'chrono-node';


export function* userDoneTyping() {
  yield put(userDoneTypingAction());
}

function* projectExport(
  successAction,
  failureAction,
  notDisplayedAction,
  displayedAction) {
  const exportWindow =
    yield call(openWindowWithContent, spinnerPageHtml);
  const {type, payload: {url, exportType}} =
    yield take([successAction, failureAction]);
  if (type === successAction) {
    if (exportWindow.closed) {
      yield put(notDisplayedAction(url, exportType));
    } else {
      exportWindow.location.href = url;
      yield put(displayedAction());
    }
  } else {
    yield call([exportWindow, 'close']);
  }
}

export function* popOutProject() {
  const project = yield select(getCurrentProject);
  const {source} = yield call(compileProject, project);
  yield call(openWindowWithContent, source);
}

export function* exportProject() {
  yield* projectExport(
    'PROJECT_EXPORTED',
    'PROJECT_EXPORT_ERROR',
    projectExportNotDisplayed,
    projectExportDisplayed,
  );
}

export function* assignmentCreated({payload: {assignment}}) {
  if (assignment.alternateLink) {
    yield put(assignmentDisplayed({
      url: assignment.alternateLink,
      exportType: 'assignment',
    }));
  } else {
    yield put(assignmentDisplayed({
      url: 'https://classroom.google.com/',
      exportType: 'assignment-draft',
    }));
  }
}

export function* assignmentSubmitted({payload: {assignment}}) {
  yield put(assignmentSubmissionDisplayed({
    url: assignment.alternateLink,
    exportType: 'assignment-submission',
  }));
}

export function* assignmentUpdated() {
  yield put(assignmentUpdateDisplayed({
    url: 'https://classroom.google.com/',
    exportType: 'assignment-update',
  }));
}

export function* updateDate(action) {
  yield put(dateInputUpdated(action.payload));
  const parsedReponse = chrono.parse(action.payload);
  let parsedDate;
  if (parsedReponse[0]) {
    parsedDate = parsedReponse[0].start.date();
  }
  yield put(parsedDateUpdated(parsedDate));
}

export default function* () {
  yield all([
    debounceFor('UPDATE_PROJECT_SOURCE', userDoneTyping, 1000),
    takeEvery('POP_OUT_PROJECT', popOutProject),
    takeEvery('EXPORT_PROJECT', exportProject),
    takeEvery('ASSIGNMENT_CREATED', assignmentCreated),
    takeEvery('ASSIGNMENT_SUBMITTED', assignmentSubmitted),
    takeEvery('ASSIGNMENT_UPDATED', assignmentUpdated),
    takeEvery('UPDATE_DATE', updateDate),
  ]);
}
