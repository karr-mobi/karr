import { defineConfig } from "taze"

export default defineConfig({
    // ignore packages from bumping
    exclude: [],
    // fetch latest package info from registry without cache
    force: false,
    // write to package.json
    write: true,
    // don't run `pnpm install` right after bumping
    install: false,
    // ignore paths for looking for package.json in monorepo
    ignorePaths: ["**/node_modules/**"],
    // ignore package.json that in other workspaces (with their own .git,pnpm-workspace.yaml,etc.)
    ignoreOtherWorkspaces: true,
    // override with different bumping mode for each package
    packageMode: {}
})
