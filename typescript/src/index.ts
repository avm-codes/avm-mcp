#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { EXECUTE_CODE_TOOL } from "./toolDefinitions.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const maxTimeout = 60 * 1000 * 10;
const baseUrl = "https://api.avm.codes";
const apiKey = process.env.AVM_API_KEY;

const printMessage = (...messages: unknown[]) => {
  // Using error to avoid interfering with MCP communication that happens on stdout
  console.error(...messages);
  console.error("--------------------------------");
};

const TOOLS = {
  [EXECUTE_CODE_TOOL.name]: EXECUTE_CODE_TOOL,
} as const;

// Create server instance
const server = new Server(
  {
    name: "avm",
    version: "1.0.1",
  },
  {
    capabilities: {
      tools: { listChanged: true },
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.values(TOOLS),
  };
});

// Handle tool execution
server.setRequestHandler(
  CallToolRequestSchema,
  async (request): Promise<CallToolResult> => {
    const { name, arguments: args } = request.params;

    const getExecutionResult = async () => {
      if (name === EXECUTE_CODE_TOOL.name) {
        const input = args as {
          code: string;
        };

        if (!apiKey || apiKey === "") {
          throw new Error("AVM_API_KEY is not set");
        }

        const timeoutPromise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Error(
                "Execution exceeded max timeout, try increasing the timeout"
              )
            );
          }, maxTimeout);
        });

        const promise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(`${baseUrl}/api/run/sync`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "avm-x-api-key": apiKey,
              },
              body: JSON.stringify({ code: input.code, language: "python" }),
            });

            if (response.ok) {
              const data = await response.json();
              resolve(data);
            } else {
              resolve({
                error: "Failed to execute python script",
                error_message: response.statusText,
                error_code: response.status,
                error_details: await response.text(),
              });
            }
          } catch (error) {
            reject({
              error: "Failed to execute python script",
              error_message: "Unknown error",
              error_code: 500,
              error_details: "Unknown error",
            });
          }
        });

        return await Promise.race([promise, timeoutPromise]);
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }
    };

    try {
      const result = await getExecutionResult();
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    } catch (error) {
      printMessage(error);
      throw error;
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AVM MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
