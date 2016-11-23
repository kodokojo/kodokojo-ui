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

import React from 'react'
import { intlShape, injectIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'

// UI library component
import { Overlay as ToolboxOverlay } from 'react-toolbox/lib/overlay'
import { snackbarFactory as toolboxSnackbarFactory } from 'react-toolbox/lib/snackbar/Snackbar'

// component
import '../../../../styles/_commons.less'
import toasterAcceptTheme from './toasterAccept.scss'
import toasterInfoTheme from './toasterInfo.scss'
import toasterWarningTheme from './toasterWarning.scss'
import Button from '../button/Button.component'
import IconButton from '../button/IconButton.component'
import FontIcon from '../fontIcon/FontIcon.component'
import CloseIcon from '../icons/CloseIcon.component'

/**
 * UI: Toaster component
 *
 */
const ToolboxSnackbar = toolboxSnackbarFactory(ToolboxOverlay, Button)
export class Toaster extends React.Component {
  static propTypes = {
    action: React.PropTypes.string,
    icon: React.PropTypes.string,
    intl: intlShape.isRequired,
    label: React.PropTypes.string,
    labelId: React.PropTypes.string,
    onClick: React.PropTypes.func,
    variant: React.PropTypes.oneOf(['accept', 'warning', 'info'])
  }
  
  render() {
    const { formatMessage } = this.props.intl
    const { action, icon, label, labelId, onClick, variant } = this.props
    const rest = { ...this.props }
    delete rest.labelId
    delete rest.variant
    delete rest.intl

    let theme
    switch (variant) {
      case 'accept':
        theme = toasterAcceptTheme
        break
      default:
      case 'info':
        theme = toasterInfoTheme
        break
      case 'warning':
        theme = toasterWarningTheme
        break
    }

    return (
      <ToolboxSnackbar
        {...rest}
        action={ action }
        label={
          <div className={ theme['message-content'] }>
            <FontIcon
              className={ theme['message-icon'] }
              value={ icon }
            />
            <div className={ theme['message-text']} >
              { !isEmpty(label) && isEmpty(labelId) &&
                label
              }
              { label === 'id' && !isEmpty(labelId) &&
                formatMessage({ id: labelId })
              }
            </div>
            { !action &&
              <IconButton
                icon={ <CloseIcon/> }
                onClick={ onClick }
                style={{ flex: '1 0 auto', width: '3.5em', height: '3.5em', marginRight: '-30px' }}
              />
            }
          </div>
        }
        theme={ theme }
      />
    )
  }
}

export default injectIntl(Toaster)
