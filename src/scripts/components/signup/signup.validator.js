import { combineValidators, isRequired } from 'revalidate'
import { captchaValidator, emailValidator } from '../../services/validator.service'

export default (values, props) => combineValidators({
  email: emailValidator('email'),
  captcha: captchaValidator('captcha')
})(values)