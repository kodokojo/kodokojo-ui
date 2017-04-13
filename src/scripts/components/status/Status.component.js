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

// component
import statusTheme from './status.scss'
import { getStatusByState } from '../../services/param.service'

export class Status extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    size: React.PropTypes.oneOf([
      'small',
      'big'
    ]),
    state: React.PropTypes.oneOf([
      'UNKNOWN',
      'STARTING',
      'CONFIGURING',
      'ONFAILURE',
      'RUNNING',
      'STOPPED'
    ])
  }

  static defaultProps = {
    size: 'small',
    state: 'UNKNOWN'
  }

  render() {
    const { state, size } = this.props
    const { formatMessage } = this.props.intl

    const status = getStatusByState(state)

    return (
      <img
        className={ statusTheme[`status--${size}`] }
        onLoad={ (e) => e.target.classList.add(statusTheme['status--loaded']) }
        src={ status.image[size] }
        title={ formatMessage({ id: `status-${status.label}-label` }) }
      />
    )
  }
}

export default injectIntl(Status)
