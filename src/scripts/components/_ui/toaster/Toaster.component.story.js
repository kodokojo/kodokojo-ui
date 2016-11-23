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
import { storiesOf, action, linkTo } from '@kadira/storybook'

// contexte

// component to story
import Toaster from './Toaster.component'

storiesOf('Toaster', module)
  .addDecorator((story) => (
    <div style={{ width: '300px', margin: '50px' }}>
      { story() }
    </div>
  ))
  .add('accept', () => (
    <Toaster
      action="I understand"
      active
      icon="question_answer"
      label="Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo uti liz ado desde o século XVI."
      onClick={ () => {} }
      onTimeout={ () => {} }
      timeout={ 2000 }
      variant="accept"
    />
  ))
  .add('cancel', () => ( 
    <Toaster
      active
      icon="question_answer"
      label="Snackbar action info"
      onClick={ () => {} }
      onTimeout={ () => {} }
      timeout={ 2000 }
      variant="info"
    />
  ))
  .add('warning', () => ( 
    <Toaster
      active
      icon="question_answer"
      label={
      `
        Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI.
        Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI.
      `}
      onClick={ () => {} }
      onTimeout={ () => {} }
      timeout={ 2000 }
      variant="warning"
    />
  ))
