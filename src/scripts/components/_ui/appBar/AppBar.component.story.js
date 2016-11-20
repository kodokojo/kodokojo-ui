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
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { storiesOf, action } from '@kadira/storybook'

// contexte
import configureStore from '../../../store/configureStore'
import en from '../../../i18n/en'

// component to story
import AppBar from './AppBar.component'

const initialState = {}

const store = configureStore(initialState)
const version = {
  api: {
    version: '1.1.0',
    branch: 'dev',
    commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
  },
  ui: {
    version: '1.1.0',
    branch: 'dev',
    commit: '26e77589fed6eb62f146dc9332c80614a0f49f40'
  }
}

storiesOf('AppBar', module)
  .addDecorator((story) => (
    <IntlProvider locale="en" messages={ en }>
      { story() }
    </IntlProvider>
  ))
  .add('with children', () => (
    <AppBar
      store={store}
      version={version}
    >
      <div>children</div>
    </AppBar>
  ))
  .add('with flat prop', () => (
    <AppBar
      flat
      store={store}
      version={version}
    />
  ))
  .add('with fixed prop', () => (
      <Provider store={store}>
        <div>
          <AppBar
            fixed
            version={version}
          />
          <div>
            <br/>
            <br/>
            <br/>
            Lorem ipsum dolor sit amet, quo ea autem dolorum expetenda. Ei case brute liber ius, eos ut diam eius,
            graecis corrumpit molestiae in has. Velit corrumpit per ad, no democritum scribentur pro.
            Quo fabellas legendos cu, velit deserunt evertitur at eam.<br/>
            Ut quo feugait appetere vulputate. Diceret perfecto inciderint ut has, his et solum labore inimicus.
            Te probatus gloriatur has, ad est virtute mandamus adolescens. Sed dictas discere et,
            sit noster audiam efficiantur ut.<br/>
            Saepe mediocrem ne mea, ius et consul commune euripidis. At tota delenit copiosae mea.
            Quis paulo invidunt ut eos. Ex justo dicam ius, ea mel dicta legimus volutpat. Nisl facilisi no eos,
            adhuc denique accusamus id pro. Nam dicit simul choro ex.<br/>
            Ne similique appellantur vim, te his liber incorrupte.
            Pro in stet admodum splendide, clita democritum et sea. Ei elit petentium qui, munere argumentum eum eu,
            mel ei atqui nostrud consectetuer. Sale ullum falli cu ius, errem discere aliquam vis eu.
            Inermis ceteros periculis mei ne, eius tritani antiopam ex vel.
            Vel probo alterum an, sea ut quidam consequuntur.<br/>
            Sint ceteros similique id eos, ex omnis facilisis scribentur duo. Primis eligendi voluptatibus at duo.
            Quo at lorem hendrerit. Et vim odio accusamus. Nec an animal recusabo erroribus. Unum menandri id vim.<br/>
            Lorem ipsum dolor sit amet, quo ea autem dolorum expetenda. Ei case brute liber ius, eos ut diam eius,
            graecis corrumpit molestiae in has. Velit corrumpit per ad, no democritum scribentur pro.
            Quo fabellas legendos cu, velit deserunt evertitur at eam.<br/>
            Ut quo feugait appetere vulputate. Diceret perfecto inciderint ut has, his et solum labore inimicus.
            Te probatus gloriatur has, ad est virtute mandamus adolescens. Sed dictas discere et,
            sit noster audiam efficiantur ut.<br/>
            Saepe mediocrem ne mea, ius et consul commune euripidis. At tota delenit copiosae mea.
            Quis paulo invidunt ut eos. Ex justo dicam ius, ea mel dicta legimus volutpat. Nisl facilisi no eos,
            adhuc denique accusamus id pro. Nam dicit simul choro ex.<br/>
            Ne similique appellantur vim, te his liber incorrupte.
            Pro in stet admodum splendide, clita democritum et sea. Ei elit petentium qui, munere argumentum eum eu,
            mel ei atqui nostrud consectetuer. Sale ullum falli cu ius, errem discere aliquam vis eu.
            Inermis ceteros periculis mei ne, eius tritani antiopam ex vel.
            Vel probo alterum an, sea ut quidam consequuntur.<br/>
            Sint ceteros similique id eos, ex omnis facilisis scribentur duo. Primis eligendi voluptatibus at duo.
            Quo at lorem hendrerit. Et vim odio accusamus. Nec an animal recusabo erroribus. Unum menandri id vim.<br/>
            Lorem ipsum dolor sit amet, quo ea autem dolorum expetenda. Ei case brute liber ius, eos ut diam eius,
            graecis corrumpit molestiae in has. Velit corrumpit per ad, no democritum scribentur pro.
            Quo fabellas legendos cu, velit deserunt evertitur at eam.<br/>
            Ut quo feugait appetere vulputate. Diceret perfecto inciderint ut has, his et solum labore inimicus.
            Te probatus gloriatur has, ad est virtute mandamus adolescens. Sed dictas discere et,
            sit noster audiam efficiantur ut.<br/>
            Saepe mediocrem ne mea, ius et consul commune euripidis. At tota delenit copiosae mea.
            Quis paulo invidunt ut eos. Ex justo dicam ius, ea mel dicta legimus volutpat. Nisl facilisi no eos,
            adhuc denique accusamus id pro. Nam dicit simul choro ex.<br/>
            Ne similique appellantur vim, te his liber incorrupte.
            Pro in stet admodum splendide, clita democritum et sea. Ei elit petentium qui, munere argumentum eum eu,
            mel ei atqui nostrud consectetuer. Sale ullum falli cu ius, errem discere aliquam vis eu.
            Inermis ceteros periculis mei ne, eius tritani antiopam ex vel.
            Vel probo alterum an, sea ut quidam consequuntur.<br/>
            Sint ceteros similique id eos, ex omnis facilisis scribentur duo. Primis eligendi voluptatibus at duo.
            Quo at lorem hendrerit. Et vim odio accusamus. Nec an animal recusabo erroribus. Unum menandri id vim.<br/>
          </div>
        </div>
      </Provider>
  ))
