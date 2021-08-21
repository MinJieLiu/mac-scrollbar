module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'arrow-body-style': 0,
    'jsx-a11y/label-has-for': 0,
    'max-lines-per-function': [2, { max: 320, skipComments: true, skipBlankLines: true }],
    'no-confusing-arrow': 0,
    'no-nested-ternary': 0,
    'no-console': 2,
    'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
    'react/no-this-in-sfc': 0,
  },
};
