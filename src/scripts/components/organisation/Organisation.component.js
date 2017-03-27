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
import organisationTheme from './organisation.scss'

const Organisation = ({
  id,
  name,
  onSelectOrganisation,
  selected
}) => (
  <div
    className={ classNames(organisationTheme['organisation'], {
      [organisationTheme['organisation--selected']]: selected
    }) }
    onClick={ () => onSelectOrganisation(id) }
    title={ name }
  >
    <FontIcon
      className={ organisationTheme['organisation-icon'] }
      value="domain"
    />
    { name }
  </div>
)

Organisation.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  onSelectOrganisation: React.PropTypes.func,
  selected: React.PropTypes.bool
}

export default Organisation
