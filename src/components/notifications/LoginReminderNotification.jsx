import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import {t} from 'i18next';

import GenericNotification from './GenericNotification';

export default function LoginReminderNotification({metadata}) {
  return <GenericNotification metadata={metadata} type="login-reminder" />;
}
