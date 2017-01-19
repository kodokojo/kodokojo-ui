/**
 * Return Intl props for mock in tests 
 */
export const getIntlPropsMock = () => {
  // TODO find another way to mock IntlProvider and redux-form
  const mockFormatFct = options => options.id
  return {
    intl: {
      formatMessage: mockFormatFct,
      formatDate: mockFormatFct,
      formatPlural: mockFormatFct,
      formatTime: mockFormatFct,
      formatRelative: mockFormatFct,
      formatNumber: mockFormatFct,
      formatHTMLMessage: mockFormatFct,
      now: mockFormatFct
    }
  }
}

/**
 * Return redux-form props for mock in tests
 */
export const getReudxFormPropsMock = () => (
  {
    asyncValidating: false,
    dirty: false,
    invalid: false,
    initialized: false,
    pristine: true,
    submitFailed: false,
    submitSucceeded: false,
    valid: false,
    // asyncValidate: () => Promise.resolve(),
    blur: () => {},
    change: () => {},
    destroy: () => {},
    dispatch: () => {},
    initialize: () => {},
    reset: () => {},
    touch: () => {},
    untouch: () => {},
    // handleSubmit: fct => fct,
    submitting: false
  }
)
