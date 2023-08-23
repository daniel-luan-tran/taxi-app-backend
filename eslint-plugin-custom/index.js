module.exports = {
  rules: {
    'no-password-include': {
      create: function (context) {
        return {
          Property(node) {
            if (
              node.key.name === 'password' &&
              node.value.type === 'Literal' &&
              node.value.value === true
            ) {
              context.report({
                node,
                message: 'Including password is not allowed.',
              });
            }
          },
        };
      },
    },
  },
};
