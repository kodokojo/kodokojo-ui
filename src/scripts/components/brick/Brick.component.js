import React, { Component, PropTypes } from 'react'
import { themr } from 'react-css-themr'
import classNames from 'classnames'

// Component
import { BRICK } from '../../commons/identifiers'
import '../../../styles/_commons.less'
import brickTheme from './brick.scss'
import { getBrickStatus, enumBrickStatus } from '../../services/param.service'

// TODO TU
// Brick component
export class Brick extends Component {

  static propTypes = {
    brick: PropTypes.object,
    theme: PropTypes.object
  }

  handleLoadStatus(e) {
    e.target.classList.add(brickTheme['brick-status--loaded'])
  }

  render() {
    const { brick, theme } = this.props // eslint-disable-line no-shadow
    const status = getBrickStatus(brick && brick.state ? brick.state : undefined)
    const brickClasses = classNames(theme.brick, theme['brick-item'])

    return (
      <div className={ brickClasses }>
        <div className={ theme['brick-type'] }>
          { brick ? brick.type : '-' }
        </div>
        <div className={ theme['brick-name'] }>
          { brick ? brick.name : '-' }
        </div>
        <div className={ theme['brick-state'] }>
          <img
            className={ theme['brick-status'] }
            onLoad={ this.handleLoadStatus }
            src={ status.image }
          />
        </div>
        <div className={ theme['brick-version'] }>
          { brick ? brick.version : '-' }
        </div>
        <div className={ theme['brick-link'] }>
          { brick && brick.url && status.label === enumBrickStatus.RUNNING.label ?
            <a href={ brick.url } target="_blank">{ brick.url }</a> :
            '-'
          }
        </div>
      </div>
    )
  }
}

export default themr(BRICK, brickTheme)(Brick)
