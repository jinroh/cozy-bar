'use strict'

import Polyglot from 'node-polyglot'
import en from '../locales/en'

const polyglot = new Polyglot({
  phrases: en,
  locale: 'en'
})

const init = function I18nInit (lang) {
  if (lang && lang !== 'en') {
    try {
      const dict = require(`../locales/${lang}`)
      polyglot.extend(dict)
      polyglot.locale(lang)
    } catch (e) {
      console.warning(`The dict phrases for "${lang}" can't be loaded`)
    }
  }
}

const t = polyglot.t.bind(polyglot)
const locale = polyglot.locale.bind(polyglot)

export default init
export { t, locale }
