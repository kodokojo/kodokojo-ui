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
import { connect } from 'react-redux'
import classNames from 'classnames'

// Component commons
import 'kodokojo-ui-commons/src/styles/_commons.less'
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'
import Page from 'kodokojo-ui-commons/src/scripts/components/page/Page.component'
import Paragraph from 'kodokojo-ui-commons/src/scripts/components/page/Paragraph.component'

import Card from 'kodokojo-ui-commons/src/scripts/components/card/Card.component'
import IconButton from 'kodokojo-ui-commons/src/scripts/components/button/IconButton.component'


// Component
import { getDbEntries, getDbEntry } from '../components/db/db.actions' 

export class Db extends React.Component {

  static propTypes = {
    currentEntry: React.PropTypes.object,
    entries: React.PropTypes.array,
    getDbEntries: React.PropTypes.func.isRequired,
    getDbEntry: React.PropTypes.func.isRequired
  }

  componentWillMount = () => {
    const { getDbEntries } = this.props

    getDbEntries()
  }
  
  render() {
    const { entries, currentEntry, getDbEntry } = this.props

    return (
      <Page>
        <h1 className={ utilsTheme['secondary-color--1'] }>
          Data Base
        </h1>
        <Paragraph>
          { entries.length && entries.length > 0 &&
            entries.map((entry, index) => (
              <Card
                className={ utilsTheme['font-color--5'] }
                key={ index }
                style={{ margin: '.5rem', padding: '.1rem' }}
              >
                <div style={{ display: 'flex', flex: '1 1 auto', flexFlow: 'row', alignItems: 'center' }}>
                  <IconButton
                    icon="play_arrow"
                    onClick={ () => getDbEntry(entry) }
                  />
                  { entry }
                </div>
                { currentEntry && currentEntry.id === btoa(entry) &&
                  <div style={{ display: 'flex', flex: '1 1 auto', flexFlow: 'row', alignItems: 'center', padding: '1.5rem' }}>
                    <textarea
                      style={{ width: '100%', minHeight: '100px', height: 'auto', border: 'none', borderRadius: '5px', background: '#C0C0CC' }}
                    >
                      { JSON.stringify(currentEntry, null, 4) }
                    </textarea>
                  </div>
                }
              </Card>
            ))
          }
        </Paragraph>
      </Page>
    )
  }
}

// DbPage container
const mapStateProps = (state, ownProps) => (
  {
    entries: state.db.entries,
    currentEntry: state.db.entry
  }
)

const DbPage = connect(
  mapStateProps,
  {
    getDbEntries,
    getDbEntry
  }
)(Db)

export default DbPage
