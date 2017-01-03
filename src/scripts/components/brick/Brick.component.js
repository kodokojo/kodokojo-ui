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
import { themr } from 'react-css-themr'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'

// Component
import { BRICK } from '../../commons/identifiers'
import brickTheme from './brick.scss'
import Status from '../status/Status.component'
import { enumStatus, getStatusByState } from '../../services/param.service'

// TODO UT
// Brick component
export class Brick extends React.Component {

  static propTypes = {
    brick: React.PropTypes.object,
    intl: intlShape.isRequired,
    theme: React.PropTypes.object
  }

  render() {
    const { brick, theme } = this.props // eslint-disable-line no-shadow

    const status = getStatusByState(brick && brick.state ? brick.state : undefined)
    const brickClasses = classNames(theme.brick, theme['brick-item'])

    return (
      <div className={ brickClasses }>
        <div className={ theme['brick-type'] }>
          { brick ? brick.type : '-' }
        </div>
        <div className={ theme['brick-name'] }>
          { brick ? brick.name : '-' }
        </div>
        <div className={ theme['brick-state'] }>
          <Status
            state={ brick ? brick.state : undefined }
          />
        </div>
        <div className={ theme['brick-version'] }>
          { brick ? brick.version : '-' }
        </div>
        <div className={ theme['brick-link'] }>
          { brick && brick.url && status.label === enumStatus.RUNNING.label ?
            <a href={ brick.url } target="_blank">{ brick.url }</a> :
            '-'
          }
        </div>
      </div>
    )
  }
}

export default themr(BRICK, brickTheme)(
  injectIntl(Brick)
)
