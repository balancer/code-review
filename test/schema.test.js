const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })
const fs = require('fs').promises;

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
            name: { type: "string" },
            summary: { type: "string" },
            review: { type: "string" },
            warnings: { type: "array", items: { type: "string" } },
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

const validate = ajv.compile(schema)

describe("Schema validation", () => {
  test("should validate the registry", async () => {
    const data = await fs.readFile('rate-providers/registry.json', 'utf8');
    const registry = JSON.parse(data);
    const valid = validate(registry);
    if (!valid) {
        console.log(validate.errors);
    }
    expect(valid).toBe(true);
  })
})
