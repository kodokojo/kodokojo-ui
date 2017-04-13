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
import { IntlProvider } from 'react-intl'
import { storiesOf } from '@kadira/storybook'

// context
import en from '../../i18n/en'

// component to story
import Menu from './Menu.component'

const menu = [
  {
    index: 0,
    labelKey: 'projects-label',
    level: 0,
    route: '#projects',
    titleKey: 'projects-label'
  },
  {
    index: 1,
    disabled: true,
    labelText: 'Kodo Kojo',
    titleText: 'Kodo Kojo'
  },
  {
    index: 2,
    labelKey: 'stacks-label',
    level: 1,
    route: '#stacks',
    titleKey: 'stacks-label'
  },
  {
    index: 3,
    labelKey: 'members-label',
    level: 2,
    route: '#members',
    titleKey: 'members-label'
  },
  {
    index: 4,
    labelKey: 'report-label',
    level: 3,
    route: '#report',
    titleKey: 'report-label'
  },
  {
    index: 5,
    labelKey: 'dashboard-label',
    level: 4,
    route: '#dashboard',
    titleKey: 'dashboard-label'
  }
]

storiesOf('Menu', module)
  .add('default', () => (
    <IntlProvider locale="en" messages={ en }>
      <div style={{ width: '200px' }}>
        <Menu
          menu={ menu }
        />
      </div>
    </IntlProvider>
  ))
