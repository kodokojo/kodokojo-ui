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

import {
  createValidator,
  composeValidators,
  isRequired,
  isAlphabetic,
  hasLengthBetween
} from 'revalidate'

const validatorService = {}

validatorService.isEmpty = (value) => value === undefined || value === null || value === ''

/**
 * Return email pattern matching
 *
 * @param value
 * @returns {boolean}
 */
validatorService.isEmailValid = (value) => !validatorService.isEmpty(value) &&
  /^(?=[\S]{6,50}$)[A-Za-z0-9._\-\+]+@(?:[A-Za-z0-9-]{1,}\.){1,}[A-Za-z]{2,}$/.test(value)

/**
 * Revalidate email pattern validator
 */
validatorService.emailValidator = composeValidators(
  isRequired({ message: 'general-input-error-required' }),
  createValidator(
    message => value => {
      if (!validatorService.isEmailValid(value)) {
        return message
      }
      return null
    },
    'email-error-pattern'
  )
)

/**
 * Revalidate captcha validator
 */
validatorService.captchaValidator = composeValidators(
  isRequired({ message: 'captcha-error-empty' })
)

/**
 * Revalidate alphanumeric and required
 */
validatorService.alphabeticRequiredValidator = composeValidators(
  isRequired({ message: 'general-input-error-required' }),
  isAlphabetic({ message: 'general-input-error-alphabetic' })
)

/**
 * Return alphabetic extended pattern matching
 * @param value
 */
// TODO UT
validatorService.isAlphabeticExtended = (value) => !validatorService.isEmpty(value) &&
  /^[A-Za-z0-9\s'’-]+$/.test(value)

/**
 * Revalidate alphanumeric and required
 */
validatorService.alphabeticExtendedRequiredValidator = composeValidators(
  isRequired({ message: 'general-input-error-required' }),
  createValidator(
    message => value => {
      if (!validatorService.isAlphabeticExtended(value)) {
        return message
      }
      return null
    },
    'alphabetic-extended-error-pattern'
  )
)

/**
 * Return project name pattern matching
 *
 * @param value
 * @returns {boolean}
 */
// TODO UT
validatorService.isProjectNameValid = (value) => !validatorService.isEmpty(value) &&
  /^[^\s]([a-zA-Z0-9\-_]{4,20})$/.test(value)

/**
 * Revalidate projectConfig name validator
 */
validatorService.projectNameValidator = composeValidators(
  isRequired({ message: 'general-input-error-required' }),
  createValidator(
    message => value => {
      if (!validatorService.isProjectNameValid(value)) {
        return message
      }
      return null
    },
    'project-name-error-pattern'
  )
)

/**
 * Return password pattern matching
 *
 * @param value
 * @returns {boolean}
 */
// TODO UT
validatorService.isPasswordValid = (value) => /^(?:[^\s]{8,256}|\B)$/.test(value)

/**
 * Revalidate password pattern validator
 */
validatorService.passwordValidator = composeValidators(
  createValidator(
    message => value => {
      if (!validatorService.isPasswordValid(value)) {
        return message
      }
      return null
    },
    'password-error-pattern'
  )
)

/**
 * Return sshkey pattern matching
 *
 * @param value
 * @returns {boolean}
 */
// TODO UT
validatorService.isSSHKeyValid = (value) => validatorService.isEmpty(value) ||
  /^(?:ssh-.*|\B)$/.test(value)

/**
 * Revalidate email pattern validator
 */
validatorService.sshkeyValidator = composeValidators(
  createValidator(
    message => value => {
      if (!validatorService.isSSHKeyValid(value)) {
        return message
      }
      return null
    },
    'sshkey-error-pattern'
  )
)

/**
 * Standard delay for debounce validation
 *
 * @type {number}
 */
validatorService.delayStandard = 800

// public API
export const email = validatorService.email
export const emailValidator = validatorService.emailValidator
export const captchaValidator = validatorService.captchaValidator
export const projectNameValidator = validatorService.projectNameValidator
export const alphabeticRequiredValidator = validatorService.alphabeticRequiredValidator
export const alphabeticExtendedRequiredValidator = validatorService.alphabeticExtendedRequiredValidator
export const passwordValidator = validatorService.passwordValidator
export const sshkeyValidator = validatorService.sshkeyValidator
export const delayStandard = validatorService.delayStandard

export default validatorService
