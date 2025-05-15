import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { z } from "zod/v4"
import { ConfigFileSchema } from "./schema.js"

const jsonSchema = z.toJSONSchema(ConfigFileSchema)

const schemaPath = path.join(process.cwd(), "config.schema.json")

fs.writeFileSync(schemaPath, JSON.stringify(jsonSchema, null, 2))
