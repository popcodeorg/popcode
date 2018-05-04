import {Record} from 'immutable';

export default class Assignment extends Record({
  courseId: null,
  id: null,
  snapshotKey: null,
  alternateLink: null,
  assignerId: null,
}) {
  static fromJS({
    courseId = null,
    id = null,
    snapshotKey = null,
    alternateLink = null,
    assignerId = null,
  }) {
    return new Assignment({
      courseId,
      id,
      snapshotKey,
      alternateLink,
      assignerId,
    });
  }
}
