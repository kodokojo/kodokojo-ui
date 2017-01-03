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

import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import fr from '../i18n/fr'
import en from '../i18n/en'

const i18n = { fr, en }

function mapStateToProps(state) {
  const locale = state.prefs.locale
  const messages = i18n[locale]
  return { locale, messages }
}

export default connect(mapStateToProps)(IntlProvider)
