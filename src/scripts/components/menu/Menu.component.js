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
import sortBy from 'lodash/sortBy'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'

// Component
import MenuItem from './MenuItem.component'

// TODO UT
// Menu component
export class Menu extends React.Component {

  static propTypes = {
    menu: React.PropTypes.object
  }

  render() {
    const { menu } = this.props // eslint-disable-line no-shadow

    return (
      <nav role="navigation">
        { Object.keys(menu).length > 0 &&
          sortBy(menu, ['index']).map((menuItem, index) => (
            <MenuItem
              active={ menuItem.active }
              disabled={ menuItem.disabled }
              index={ menuItem.index }
              key={ index }
              labelKey={ menuItem.labelKey }
              labelText={ menuItem.labelText }
              level={ menuItem.level }
              onClick={ menuItem.onClick }
              route={ menuItem.route }
              titleKey={ menuItem.titleKey }
              titleText={ menuItem.titleText }
            />
          ))
        }
      </nav>
    )
  }
}

export default Menu
