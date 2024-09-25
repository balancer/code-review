const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })
const fs = require("fs").promises
const path = require("path")

// registry.json schema definition
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
            isAllowed: { type: "string", enum: ["true", "false"] },
            review: { type: "string", minLength: 1, pattern: "^\\./"},
            warnings: {
              type: "object",
              properties: {
                legacy: { type: "string" },
                donation: { type: "string" },
                only18decimals: { type: "string" },
                eoaUpgradeable: { type: "string" },
                chainlink: { type: "string" },
                verification: { type: "string" },
              },
              additionalProperties: false,
              minProperties: 0
            },
            factory: { type: "string" },
            upgradeableComponents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entrypoint: {
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                  },
                  implementationReviewed: {
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                  },
                },
                required: ["entrypoint", "implementationReviewed"],
                additionalProperties: false,
              },
            },
            conclusion: { type: "string", minLength: 1},
          },
          required: [
            "asset",
            "name",
            "summary",
            "isAllowed",
            "review",
            "warnings",
            "factory",
            "upgradeableComponents",
            "conclusion",
          ],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

const validate = ajv.compile(schema)

describe("Schema validation", () => {
  test("should validate the registry", async () => {
    const data = await fs.readFile("rate-providers/registry.json", "utf8")
    const registry = JSON.parse(data)
    const valid = validate(registry)
    if (!valid) {
      console.log(validate.errors)
    }
    expect(valid).toBe(true)
  })
})

describe("Review files exist", () => {
  test("should check that all reviews exist", async () => {
    const data = await fs.readFile("rate-providers/registry.json", "utf8")
    const registry = JSON.parse(data)
    const reviews = []

    for (const network in registry) {
      for (const address in registry[network]) {
        const reviewPath = path.join(
          __dirname,
          "..",
          "rate-providers",
          registry[network][address].review.replace("./", ""),
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
