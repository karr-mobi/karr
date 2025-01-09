export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat", // new feature for the user, not a new feature for build script
                "fix", // bug fix for the user
                "docs", // changes to the documentation
                "refactor", // refactoring production code, no user facing changes, no new features
                "perf", // performance improvements
                "test", // adding missing tests, refactoring tests; no production code change
                "chore", // updating grunt tasks etc; no production code change
                "build", // changes that affect the build system or external dependencies
                "ci", // changes to our CI configuration files and scripts
                "revert", // revert commits
                "refactor" // a code change that neither fixes a bug nor adds a feature
            ]
        ]
    }
}
