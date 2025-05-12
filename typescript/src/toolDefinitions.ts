import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const EXECUTE_CODE_TOOL: Tool = {
  name: "execute_code",
  description: "Execute arbitrary Python code.",
  inputSchema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description:
          "The code you are writing. This will be executed as a script. Write any output to stdout or stderr.",
      },
    },
  },
} as const;
