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

import React, { Component, PropTypes } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import { themr } from 'react-css-themr'

// UI library component
import { AppBar as ToolboxAppBar } from 'react-toolbox'

// component
import { APP_BAR } from '../../../commons/identifiers'
import '../../../../styles/_commons.less'
import appBarTheme from './appBar.scss'
import logoKodoKojo from '../../../../images/logo-white-kodokojo.svg'
import IconButton from '../../_ui/button/IconButton.component'

/**
 * UI: AppBar component
 */
export class AppBar extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
      PropTypes.string
    ]),
    fixed: PropTypes.bool,
    flat: PropTypes.bool,
    intl: intlShape.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    theme: PropTypes.object,
    version: React.PropTypes.object
  }

  render() {
    const { children, fixed, flat, isAuthenticated, onLogout, theme, version } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <ToolboxAppBar
        className={ theme['header-bar'] }
        fixed={ fixed }
        flat={ flat }
      >
        <img
          className={ theme['logo-kodokojo'] }
          src={ logoKodoKojo }
          title={
            `api\n${version.api.version}\n${version.api.branch}\n${version.api.commit}\n\n` +
            `ui\n${version.ui.version}\n${version.ui.branch}\n${version.ui.commit}`
          }
        />
        { children }
        { isAuthenticated &&
          <IconButton
            icon="power_settings_new"
            onClick={ () => onLogout() }
            style={{ display: 'flex', selfAlign: 'flex-end' }}
            title={ formatMessage({ id: 'logout-label' }) }
          />
        }
      </ToolboxAppBar>
    )
  }
}

export default themr(APP_BAR, appBarTheme)(injectIntl(AppBar))
