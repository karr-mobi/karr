import { PlopTypes } from "@turbo/gen"

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setGenerator("package", {
        description:
            "Generate a new package in the workspace. This will create a new directory with the package name and a package.json file.",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "What is the name of the new package to create?",
                validate: (input: string) => {
                    if (!input) {
                        return "Package name is required"
                    }
                    if (!/^[\w\d-]+$/g.test(input)) {
                        return "Package name can only contain letters, numbers, and dashes"
                    }
                    return true
                }
            }
        ],
        actions: [
            // Handle template (.hbs) files
            {
                type: "addMany",
                destination: "{{ turbo.paths.root }}/packages/{{ dashCase name }}",
                templateFiles: "templates/package/**/*.hbs",
                base: "templates/package"
            },
            // Handle non-template files
            {
                type: "addMany",
                destination: "{{ turbo.paths.root }}/packages/{{ dashCase name }}",
                templateFiles: ["templates/package/**/*", "!templates/package/**/*.hbs"],
                base: "templates/package",
                globOptions: {
                    dot: true // Include dotfiles
                }
            }
        ]
    })
}
