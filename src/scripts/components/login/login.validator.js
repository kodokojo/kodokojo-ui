import { combineValidators, isRequired } from 'revalidate'

export default (values, props) => combineValidators({
  username: isRequired({ message: 'general-input-error-required' }),
  password: isRequired({ message: 'general-input-error-required' })
})(values)