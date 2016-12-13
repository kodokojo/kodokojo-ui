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
import { Link } from 'react-router'
import { intlShape, injectIntl, FormattedMessage } from 'react-intl'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import AppBar from 'kodokojo-ui-commons/src/scripts/components/appBar/AppBar.component'
import IconButton from 'kodokojo-ui-commons/src/scripts/components/button/IconButton.component'

// Component
import themeAppHeader from './appHeader.scss'

// AppHeader
export class AppHeader extends React.Component {

  static propTypes = {
    help: React.PropTypes.string,
    intl: intlShape.isRequired,
    isAuthenticated: React.PropTypes.bool.isRequired,
    languageSelected: React.PropTypes.string,
    onLanguageChange: React.PropTypes.func,
    onLogout: React.PropTypes.func.isRequired,
    version: React.PropTypes.object
  }

  render() {
    const { help, languageSelected, onLanguageChange, onLogout, isAuthenticated, version } = this.props // eslint-disable-line no-shadow
    const { formatMessage } = this.props.intl

    return (
      <AppBar
        flat
        isAuthenticated={ isAuthenticated }
        onLogout={ () => onLogout() }
        version={ version }
      >
        { version &&
          <div className={ themeAppHeader['header-version'] }>
            {
              `${version.api ? `api ${version.api.version}`: ''} - ` +
              `${version.ui ? `ui ${version.ui.version}`: ''}`
            }
          </div>
        }
        { isAuthenticated &&
          <div className={ themeAppHeader['menu-personal'] }>
            {/* uncomment for future use
             <IconButton
             icon="person"
             onClick={ () => onLogout() }
             title={ formatMessage({ id: 'help-label' }) }
             />
             <IconButton
             className={ themeAppHeader['menu-personal__item--smaller'] }
             icon="chat_bubble"
             onClick={ () => onLogout() }
             title={ formatMessage({ id: 'help-label' }) }
             />
           */}
            <IconButton
              className={ themeAppHeader['menu-personal__item--small'] }
              icon="help"
              onClick={ () => window.location.href = `mailto:${help}` }
              title={ formatMessage({ id: 'help-label' }) }
            />
            <IconButton
              icon="power_settings_new"
              onClick={ () => onLogout() }
              title={ formatMessage({ id: 'logout-label' }) }
            />
          </div>
        }
      </AppBar>
      // FIXME this is for testing purpose, delete when tabs are implemented
      // <Navigation type="horizontal">
      //   <Link to="/">
      //   <FormattedMessage id={'app-menu-home-label'}/>
      //   </Link>
      //   {' | '}
      //   <Link to="/users">
      //     <FormattedMessage id={'app-menu-users-label'}/>
      //   </Link>
      // </Navigation>

      // TODO move this in app header, set param to show / hide language switch + automatically browser available languages
      // <DropDownMenu
      //   className={ 'locale-selector' }
      //   labelStyle={ {color: '#fff'} }
      //   onChange={ (event,i,v) => onLanguageChange(v) }
      //   value={ languageSelected }
      // >
      //   <MenuItem primaryText={ formatMessage({id:'app-lang-en-label'}) }
      //             value="en"
      //   />
      //   <MenuItem primaryText={ formatMessage({id:'app-lang-fr-label'}) }
      //             value="fr"
      //   />
      // </DropDownMenu>
    )
  }
}

export default injectIntl(AppHeader)
