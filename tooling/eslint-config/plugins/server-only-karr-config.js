let hasServerOnlyImport = false
const karrConfigImportNodes = []
let foundKarrConfig = false // Track finding the import

function importExportHandler(context, node) {
    try {
        if (node.source.value === "server-only") {
            hasServerOnlyImport = true
        } else if (node.source.value === "@karr/config") {
            karrConfigImportNodes.push(node.source)
            foundKarrConfig = true
        }
    } catch (e) {
        console.error(
            `[Custom Rule] Error in importExportHandler visitor for ${context.getFilename()}:`,
            e
        )
    }
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
    rules: {
        "enforce-server-only-for-karr-config": {
            meta: {
                type: "problem",
                docs: {
                    description:
                        "Enforce that '@karr/config' is only imported in files that also import 'server-only'.",
                    category: "Best Practices",
                    recommended: "error",
                    url: ""
                },
                fixable: null,
                schema: [],
                messages: {
                    restricted:
                        'Importing "@karr/config" is only allowed in files that contain `import "server-only"`.'
                }
            },
            create(context) {
                // --- State variables INSIDE create ---
                let hasServerOnlyImport = false
                const karrConfigImportNodes = []
                // ---

                // Helper function can access state via closure
                function checkNodeSource(node) {
                    // Only proceed if the node has a source (import/export 'from')
                    if (!node.source) {
                        return
                    }

                    try {
                        const sourceValue = node.source.value // Get the string value (e.g., "server-only")
                        if (sourceValue === "server-only") {
                            hasServerOnlyImport = true
                        } else if (sourceValue === "@karr/config") {
                            // Store the source node itself for reporting
                            karrConfigImportNodes.push(node.source)
                        }
                    } catch (e) {
                        // Add more context to error logging if needed
                        console.error(
                            `[Custom Rule] Error processing node source in ${context.getFilename()}:`,
                            e,
                            node // Log the problematic node
                        )
                    }
                }

                return {
                    // Check regular imports
                    ImportDeclaration(node) {
                        checkNodeSource(node)
                    },

                    // Check exports like `export { foo } from './bar'`
                    ExportNamedDeclaration(node) {
                        checkNodeSource(node) // Safe now due to the check inside
                    },

                    // Check exports like `export * from './bar'`
                    ExportAllDeclaration(node) {
                        checkNodeSource(node)
                    },

                    // Check the final state when ESLint is done with the file
                    "Program:exit"(node) {
                        try {
                            // If karr/config was imported but server-only was not...
                            if (
                                karrConfigImportNodes.length > 0 &&
                                !hasServerOnlyImport
                            ) {
                                // Report an error for each karr/config import found
                                karrConfigImportNodes.forEach(
                                    (importSourceNode) => {
                                        context.report({
                                            node: importSourceNode,
                                            messageId: "restricted"
                                        })
                                    }
                                )
                            }
                            // No need to reset state here - it's scoped to `create`
                        } catch (e) {
                            console.error(
                                `[Custom Rule] Error in Program:exit visitor for ${context.getFilename()}:`,
                                e
                            )
                        }
                    }
                }
            }
        }
    }
}
