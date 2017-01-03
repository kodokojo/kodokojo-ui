/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2017 Kodo Kojo (infos@kodokojo.io)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import { intlShape, injectIntl } from 'react-intl'

// we don't validate propTypes for redux-form because we will have to filter all none used in toolbox component
// see https://github.com/Hacker0x01/react-datepicker/issues/517#issuecomment-230119718
/* eslint-disable react/prop-types */

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'

// Component
import errorTheme from './message.scss'

/**
 * UI: Error Message component
 *
 */
class ErrorMessage extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    intl: intlShape.isRequired
  }

  render() {
    const { formatMessage } = this.props.intl
    const { input, meta, errorKey } = this.props

    return (
      <div
        className={ errorTheme['message--error'] }
      >
        { meta && meta.touched && meta.error &&
          formatMessage({ id: meta.error }, { fieldName: errorKey ? formatMessage({ id: errorKey }) : '' })
        }
      </div>
    )
  }
}

export default injectIntl(ErrorMessage)
