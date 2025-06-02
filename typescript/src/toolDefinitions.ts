import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const EXECUTE_CODE_TOOL: Tool = {
  name: "execute_code",
  description: `
  This tool runs a python self-contained, executable code snippet. When writing code:

  1. Each snippet should be complete and runnable on its own
  2. Prefer using print() statements to display outputs
  3. Include helpful comments explaining the code
  4. Keep snippets concise (generally under 15 lines)
  5. Avoid external dependencies - use Python standard library
  6. Handle potential errors gracefully
  7. Return meaningful output that demonstrates the code's functionality
  8. Don't use input() or other interactive functions
  9. Don't access files or network resources
  10. Don't use infinite loops
  
  Examples of good snippets:
  
  # Calculate factorial iteratively
  def factorial(n):
      result = 1
      for i in range(1, n + 1):
          result *= i
      return result
  
  print(f"Factorial of 5 is: {factorial(5)}")`,
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
