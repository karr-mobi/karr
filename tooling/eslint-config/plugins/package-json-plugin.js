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
                    Property(node) {
                        // Check if we're in a dependencies section
                        const propName = node.key.value
                        if (
                            [
                                "dependencies",
                                "devDependencies",
                                "peerDependencies",
                                "optionalDependencies"
                            ].includes(propName) &&
                            node.value.type === "ObjectExpression"
                        ) {
                            // Check each dependency
                            node.value.properties.forEach((dep) => {
                                if (
                                    dep.key &&
                                    dep.value &&
                                    dep.value.type === "Literal"
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
                    }
                }
            }
        }
    }
}
