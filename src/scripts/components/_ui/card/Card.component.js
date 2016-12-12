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
import { themr } from 'react-css-themr'
import classNames from 'classnames'

// component
import { CARD } from '../../../commons/identifiers'
import '../../../../styles/_commons.less'
import cardTheme from './card.scss'

/**
 * UI: Card component
 *
 */
export class Card extends React.Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.element),
      React.PropTypes.element,
      React.PropTypes.string,
      React.PropTypes.node
    ]),
    className: React.PropTypes.string,
    merged: React.PropTypes.bool,
    primary: React.PropTypes.bool,
    row: React.PropTypes.bool,
    style: React.PropTypes.object,
    theme: React.PropTypes.object,
    title: React.PropTypes.string
  }

  render() {
    const { children, className, merged, primary, row, style, theme, title } = this.props // eslint-disable-line no-shadow
    const cardClasses = classNames(theme.card, {
      [theme['card--merged']]: merged,
      [theme['card--primary']]: primary,
      [theme['card--default']]: !primary,
      [theme['card-row']]: row
    }, className)

    return (
      <div
        className={ cardClasses }
        style={ style }
      >
        { title &&
          <div className={ theme['card-title'] }>
            { title }
          </div>
        }
        { children }
      </div>
    )
  }
}

export default themr(CARD, cardTheme)(Card)
