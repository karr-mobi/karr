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
                    recommended: "error", // Let's ensure it's 'error'
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
                try {
                    return {
                        ImportDeclaration(node) {
                            importExportHandler(context, node)
                        },

                        ExportNamedDeclaration(node) {
                            importExportHandler(context, node)
                        },

                        ExportAllDeclaration(node) {
                            importExportHandler(context, node)
                        },

                        "Program:exit"(node) {
                            try {
                                if (
                                    karrConfigImportNodes.length > 0 &&
                                    !hasServerOnlyImport
                                ) {
                                    karrConfigImportNodes.forEach(
                                        (importSourceNode) => {
                                            context.report({
                                                node: importSourceNode,
                                                messageId: "restricted"
                                            })
                                        }
                                    )
                                }

                                hasServerOnlyImport = false
                                karrConfigImportNodes.length = 0
                                foundKarrConfig = false
                            } catch (e) {
                                console.error(
                                    `[Custom Rule] Error in Program:exit visitor for ${context.getFilename()}:`,
                                    e
                                )
                            }
                        }
                    }
                } catch (e) {
                    console.error(
                        `[Custom Rule] Error in create function for ${context.getFilename()}:`,
                        e
                    )
                    // Return empty object if create fails, though this shouldn't happen here
                    return {}
                }
            }
        }
    }
}
