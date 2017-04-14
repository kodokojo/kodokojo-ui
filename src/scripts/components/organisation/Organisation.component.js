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
import classNames from 'classnames'

// Component commons
import FontIcon from 'kodokojo-ui-commons/src/scripts/components/fontIcon/FontIcon.component'

// Component
import theme from './organisation.scss'

const Organisation = ({
  id,
  name,
  onSelectOrganisation,
  projectConfigsNumber,
  selected,
  usersNumber
}) => (
  <div
    className={ classNames(theme['organisation'], {
      [theme['organisation--selected']]: selected
    }) }
    onClick={ () => onSelectOrganisation(id) }
    title={ name }
  >
    <div className={ theme['organisation-header']}>
      <FontIcon
        className={ theme['organisation-icon'] }
        value="domain"
      />
      { name }
    </div>
    <div className={ theme['organisation-info']}>
      <div className={ theme['info-projects']}>
        <FontIcon
          className={ theme['info-icon'] }
          value="layers"
        />
        { projectConfigsNumber }
      </div>
      <div className={ theme['info-users']}>
        <FontIcon
          className={ theme['info-icon'] }
          value="person"
        />
        { usersNumber }
      </div>
    </div>
    <div className={ theme['organisation-footer']}>
      { ' ' }
    </div>
  </div>
)

Organisation.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  onSelectOrganisation: React.PropTypes.func,
  projectConfigsNumber: React.PropTypes.number,
  selected: React.PropTypes.bool,
  usersNumber: React.PropTypes.number
}

export default Organisation
