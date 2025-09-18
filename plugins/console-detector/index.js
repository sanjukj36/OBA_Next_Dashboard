module.exports = {
  rules: {
    "no-console": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow specific console methods",
          recommended: "error"
        },
        messages: {
          noConsole: "Unexpected console.{{method}} statement."
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              allowedMethods: {
                type: "array",
                items: { type: "string" }
              }
            },
            additionalProperties: false
          }
        ]
      },
      create(context) {
        const options = context.options[0] || {};
        const allowedMethods = options.allowedMethods || ["error", "warn"];

        return {
          MemberExpression(node) {
            if (
              node.object.type === "Identifier" &&
              node.object.name === "console" &&
              node.property.type === "Identifier" &&
              !allowedMethods.includes(node.property.name)
            ) {
              context.report({
                node,
                messageId: "noConsole",
                data: {
                  method: node.property.name
                },
                fix(fixer) {
                  return fixer.remove(node.parent);
                }
              });
            }
          }
        };
      }
    }
  }
};
