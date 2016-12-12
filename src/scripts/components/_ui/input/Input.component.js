/**
 * Kodo Kojo - Software factory done right
 * Copyright © 2016 Kodo Kojo (infos@kodokojo.io)
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

// we don't validate propTypes for redux-form because we will have to filter all none used in toolbox component
// see https://github.com/Hacker0x01/react-datepicker/issues/517#issuecomment-230119718
/* eslint-disable react/prop-types */

import React from 'react'
import { intlShape, injectIntl } from 'react-intl'

// UI library component
import { Input as ToolboxInput } from 'react-toolbox/lib/input'

// component
import '../../../../styles/_commons.less'
import inputTheme from './input.scss'

/**
 * UI: Input component
 *
 */
class Input extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired
  }

  render() {
    const { formatMessage } = this.props.intl
    const { input, meta, errorKey } = this.props
    const rest = { ...this.props }
    delete rest.intl
    delete rest.input
    delete rest.meta
    delete rest.errorKey

    return (
      <ToolboxInput
        {...rest}
        {...input}
        error={ 
          meta && meta.touched && meta.error ?
            formatMessage({ id: meta.error }, {
              fieldName: errorKey ? formatMessage({ id: errorKey }) : ''
            }) : ''
        }
        theme={ inputTheme }
      />
    )
  }
}

export default injectIntl(Input)
