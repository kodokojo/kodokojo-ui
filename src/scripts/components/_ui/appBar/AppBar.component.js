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
import { themr } from 'react-css-themr'

// UI library component
import { AppBar as ToolboxAppBar } from 'react-toolbox'

// component
import { APP_BAR } from '../../../commons/identifiers'
import '../../../../styles/_commons.less'
import appBarTheme from './appBar.scss'
import logoKodoKojo from '../../../../images/logo-white-kodokojo.svg'

/**
 * UI: AppBar component
 */
export class AppBar extends React.Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.element),
      React.PropTypes.element,
      React.PropTypes.string,
      React.PropTypes.node
    ]),
    fixed: React.PropTypes.bool,
    flat: React.PropTypes.bool,
    intl: intlShape.isRequired,
    isAuthenticated: React.PropTypes.bool.isRequired,
    onLogout: React.PropTypes.func.isRequired,
    theme: React.PropTypes.object,
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
            version ?
            `${version.api ? `api\nv${version.api.version}\nbranch: ${version.api.branch}\ncommit: ${version.api.commit.substring(0, 7)}\n\n`: ''}` +
            `${version.ui ? `ui\nv${version.ui.version}\nbranch: ${version.ui.branch}\ncommit: ${version.ui.commit.substring(0, 7)}`: ''}` :
            ''
          }
        />
        { children }
      </ToolboxAppBar>
    )
  }
}

export default themr(APP_BAR, appBarTheme)(injectIntl(AppBar))
