export default {
    rules: {
        "no-direct-dependency-versions": {
            meta: {
                type: "problem",
                docs: {
                    description:
                        "Ensure all dependency versions are specified in the dependency catalog"
                }
            },
            create(context) {
                return {
                    // Handle JSON Member nodes instead of Property
                    JSONExpressionStatement(node) {
                        if (!node.expression || !node.expression.properties) {
                            return
                        }

                        // Find dependency sections
                        const dependencySections = [
                            "dependencies",
                            "devDependencies",
                            "peerDependencies",
                            "optionalDependencies"
                        ]

                        // Loop through all properties to find dependency sections
                        node.expression.properties.forEach((prop) => {
                            if (
                                prop.key &&
                                prop.key.type === "JSONLiteral" &&
                                dependencySections.includes(prop.key.value) &&
                                prop.value &&
                                prop.value.type === "JSONObjectExpression"
                            ) {
                                // Check each dependency in this section
                                prop.value.properties.forEach((dep) => {
                                    if (
                                        dep.key &&
                                        dep.value &&
                                        dep.value.type === "JSONLiteral"
                                    ) {
                                        const depName = dep.key.value
                                        const version = dep.value.value

                                        if (
                                            typeof version === "string" &&
                                            !version.startsWith("workspace:") &&
                                            !version.startsWith("catalog:")
                                        ) {
                                            // Check for broad version specs
                                            if (version === "*" || version === "latest") {
                                                context.report({
                                                    node: dep,
                                                    message: `Broad version specification for "${depName}" is not allowed. Please specify a specific version.`
                                                })
                                            }
                                            // Check for direct versions
                                            else if (/\d/.test(version)) {
                                                context.report({
                                                    node: dep,
                                                    message: `Direct version specification for "${depName}" is not allowed. Use the dependency catalog in pnpm-workspace.yaml instead.`
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }
    }
}
