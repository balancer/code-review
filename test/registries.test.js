// npx jest test/registries.test.js
//
// Validates every registry.json against its schema and checks that all
// referenced review files exist. To cover a new registry, add an entry to
// REGISTRIES below.

const fs = require("fs").promises
const path = require("path")
const Ajv = require("ajv")

const ajv = new Ajv({ allErrors: true })

const address = { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }

// rate-providers/registry.json
const rateProviderSchema = {
  type: "object",
  patternProperties: {
    "^[a-z]+$": {
      type: "object",
      patternProperties: {
        "^0x[a-fA-F0-9]{40}$": {
          type: "object",
          properties: {
            asset: address,
            name: { type: "string", minLength: 1 },
            summary: { type: "string", enum: ["safe", "unsafe"] },
            review: { type: "string", minLength: 1 },
            warnings: { type: "array", items: { type: "string" } },
            factory: { type: "string" },
            upgradeableComponents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entrypoint: address,
                  implementationReviewed: address,
                },
                required: ["entrypoint", "implementationReviewed"],
                additionalProperties: false,
              },
            },
          },
          required: [
            "asset",
            "name",
            "summary",
            "review",
            "warnings",
            "factory",
            "upgradeableComponents",
          ],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

// erc4626/registry.json
const erc4626Schema = {
  type: "object",
  patternProperties: {
    "^[a-z]+$": {
      type: "object",
      patternProperties: {
        "^0x[a-fA-F0-9]{40}$": {
          type: "object",
          properties: {
            asset: address,
            name: { type: "string", minLength: 1 },
            summary: { type: "string", enum: ["safe", "unsafe"] },
            review: { type: "string", minLength: 1 },
            warnings: { type: "array", items: { type: "string" } },
            canUseBufferForSwaps: { type: "boolean" },
            useUnderlyingForAddRemove: { type: "boolean" },
            useWrappedForAddRemove: { type: "boolean" },
          },
          required: [
            "asset",
            "name",
            "summary",
            "review",
            "warnings",
            "canUseBufferForSwaps",
            "useUnderlyingForAddRemove",
            "useWrappedForAddRemove",
          ],
        },
      },
    },
  },
  additionalProperties: false,
}

// hooks/registry.json (no asset; hooks act on pools, not a single wrapped asset)
const hooksSchema = {
  type: "object",
  patternProperties: {
    "^[a-z]+$": {
      type: "object",
      patternProperties: {
        "^0x[a-fA-F0-9]{40}$": {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1 },
            summary: { type: "string", enum: ["safe", "unsafe"] },
            review: { type: "string", minLength: 1 },
            warnings: { type: "array", items: { type: "string" } },
          },
          required: ["name", "summary", "review", "warnings"],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

const REGISTRIES = [
  { name: "rate-providers", file: "rate-providers/registry.json", schema: rateProviderSchema },
  { name: "erc4626", file: "erc4626/registry.json", schema: erc4626Schema },
  { name: "hooks", file: "hooks/registry.json", schema: hooksSchema },
]

describe.each(REGISTRIES)("$name registry", ({ file, schema }) => {
  const validate = ajv.compile(schema)
  let registry

  // A syntax error (e.g. an unresolved merge conflict) makes JSON.parse throw
  // here, which fails every test in this block.
  beforeAll(async () => {
    registry = JSON.parse(await fs.readFile(file, "utf8"))
  })

  test("matches its schema", () => {
    const valid = validate(registry)
    if (!valid) {
      console.log(validate.errors)
    }
    expect(valid).toBe(true)
  })

  test("every referenced review file exists", async () => {
    const dir = path.dirname(file)
    const missing = []

    for (const network in registry) {
      for (const addr in registry[network]) {
        const reviewPath = path.join(dir, registry[network][addr].review)
        try {
          await fs.access(reviewPath)
        } catch (error) {
          console.log(`Missing file: ${reviewPath}`)
          missing.push(reviewPath)
        }
      }
    }

    expect(missing).toEqual([])
  })
})
