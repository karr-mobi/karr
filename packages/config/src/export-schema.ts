import { z } from "zod"
import { ConfigFileSchema } from "./schema.js"
import fs from "node:fs"
import path from "node:path"

const jsonSchema = z.toJSONSchema(ConfigFileSchema)

const schemaPath = path.join(process.cwd(), "config.schema.json")

fs.writeFileSync(schemaPath, JSON.stringify(jsonSchema, null, 2))
console.log(`Schema written to ${schemaPath}`)
