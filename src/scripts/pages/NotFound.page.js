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
import { connect } from 'react-redux'
// import DocumentMeta from 'react-document-meta'

// Component commons
import Card from 'kodokojo-ui-commons/src/scripts/components/card/Card.component'
import CardContent from 'kodokojo-ui-commons/src/scripts/components/card/CardContent.component'
import CardContainer from 'kodokojo-ui-commons/src/scripts/components/card/CardContainer.component'

// const metaData = {
//  title: '404 Page Not Found',
//  description: 'KodoKojo',
//  meta: {
//    charset: 'utf-8',
//    name: {
//      keywords: 'test, keyword, other',
//    }
//  }
// }

export class NotFound extends React.Component {

  static propTypes = {
    contentFromRoute: React.PropTypes.string.isRequired,
    status: React.PropTypes.number.isRequired
  }

  render() {
    const { status, contentFromRoute } = this.props
    return (
      <CardContainer>
        <Card
          title={ `${status} NotFound` }
        >
          <CardContent>
              <p>{ contentFromRoute }</p>
          </CardContent>
        </Card>
      </CardContainer>
    )
  }
}

// NotFounPage container
const mapStateProps = (state, ownProps) => (
  {
    status: ownProps.route.status,
    contentFromRoute: ownProps.route.contentFromRoute
  }
)

const NotFoundPage = connect(
    mapStateProps
)(NotFound)

export default NotFoundPage
