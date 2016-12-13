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

// Component commons
import utilsTheme from 'kodokojo-ui-commons/src/styles/_utils.scss'

// TODO UT
// TODO implement i18n
export class Account extends React.Component {

  static propTypes = {
    account: React.PropTypes.object.isRequired
  }

  render() {
    const { account } = this.props // eslint-disable-line no-shadow

    return (
      <div>
        { account.id &&
          <div>
            <p>
              <b>Thanks for your subscription!</b><br/>
              Remember to <strong className={ utilsTheme['secondary-color--1'] }>save all your connexion information:</strong>
            </p>
            <div>
              <b>email:</b>
            </div>
            <div>{account.email}</div>
            <br/>
            <div>
              <b>username:</b>
            </div>
            <div>{account.userName}</div>
            <br/>
            <div>
              <b>password:</b>
            </div>
            <div>{account.password}</div>
            { account.sshKeyPublic &&
              <p>
              <a download={'kodokojoKey.pub'}
                 href={`data:text/plain;charset=utf-8,${encodeURIComponent(account.sshKeyPublic)}`}
              >ssh public key</a>
              </p>
            }
            { account.sshKeyPrivate &&
              <p>
                <a download={'kodokojoPrivateKey.txt'}
                   href={`data:text/plain;charset=utf-8,${encodeURIComponent(account.sshKeyPrivate)}`}
                >ssh private key</a>
              </p>
            }
          </div>
        }
        { !account.id &&
            <div>No account</div>
        }
      </div>
    )
  }

}

// Account container
const mapStateProps = (state) => (
  {
    account: state.auth.account || {}
  }
)

const AccountContainer = connect(
    mapStateProps
)(Account)

export default AccountContainer
