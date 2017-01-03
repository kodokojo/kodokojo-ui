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

// FIXME false positive with functional component
/* eslint-disable react/prop-types */

import React from 'react'

// Component commons
import Button from 'kodokojo-ui-commons/src/scripts/components/button/Button.component'

const UserAddButton = ({
  disabled,
  label,
  onToggleForm
}) => (
  <Button
    accent
    disabled={ disabled }
    icon="add_circle_outline"
    label={ label }
    onMouseUp={ onToggleForm }
    type="button"
  />
)

UserAddButton.protoTypes = {
  disabled: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onToggleForm: React.PropTypes.func.isRequired
}

UserAddButton.defaultProps = {
  disabled: false,
  label: ''
}

export default UserAddButton
