import { combineValidators, matchesField } from 'revalidate'

import {
  alphabeticExtendedRequiredValidator,
  emailValidator,
  passwordValidator,
  sshkeyValidator
} from '../../services/validator.service'

export default (values, props) => {
  if (props.creation) {
    return combineValidators({
      email: emailValidator('email')
    })(values)
  }
  if (props.edition) {
    return combineValidators({
      email: emailValidator('email'),
      firstName: alphabeticExtendedRequiredValidator('firstName'),
      lastName: alphabeticExtendedRequiredValidator('lastName'),
      password: passwordValidator('password'),
      passwordConfirm: matchesField('password')({ message: 'password-confirm-error' }),
      sshKeyPublic: sshkeyValidator('sshKeyPublic')
    })(values)
  }
  return {}
}