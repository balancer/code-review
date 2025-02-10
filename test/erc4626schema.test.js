const fs = require("fs").promises
const path = require("path")
const Ajv = require("ajv")
const ajv = new Ajv()

// Define the schema for the ERC4626 registry
const schema = {
  type: "object",
  patternProperties: {
    "^[a-z]+$": {
      type: "object",
      patternProperties: {
        "^0x[a-fA-F0-9]{40}$": {
          type: "object",
          properties: {
            asset: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
            name: { type: "string", minLength: 1 },
            summary: { type: "string", enum: ["safe", "unsafe"] },
            review: { type: "string", minLength: 1 },
            warnings: { type: "array", items: { type: "string" } },
            canUseBufferForSwaps: { type: "string", enum: ["true", "false"] },
            useUnderlyingForAddRemove: {
              type: "string",
              enum: ["true", "false"],
            },
            useWrappedForAddRemove: { type: "string", enum: ["true", "false"] },
          },
          required: [
            "asset",
            "name",
            "summary",
            "review",
            "warnings",
            "useBufferForSwaps",
            "useUnderlyingForAddRemove",
            "useWrappedForAddRemove",
          ],
        },
      },
    },
  },
  additionalProperties: false,
}

const validate = ajv.compile(schema)

describe("ERC4626 Schema validation", () => {
  test("should validate the ERC4626 registry", async () => {
    const data = await fs.readFile("erc4626/registry.json", "utf8")
    const registry = JSON.parse(data)
    const valid = validate(registry)
    if (!valid) {
      console.log(validate.errors)
    }
    expect(valid).toBe(true)
  })
})

describe("ERC4626 Review files exist", () => {
  test("should check that all reviews exist", async () => {
    const data = await fs.readFile("erc4626/registry.json", "utf8")
    const registry = JSON.parse(data)
    const reviews = []

    for (const network in registry) {
      for (const address in registry[network]) {
        const reviewPath = path.join(
          __dirname,
          "..",
          "erc4626",
          registry[network][address].review,
        )
        reviews.push(reviewPath)
      }
    }

    const missingReviews = []
    for (const review of reviews) {
      try {
        await fs.access(review)
      } catch (error) {
        console.log(`Missing file: ${review}`)
        missingReviews.push(review)
      }
    }

    expect(missingReviews.length).toBe(0)
  })
})
