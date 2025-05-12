# AVM MCP Server

[AVM](https://avm.codes) offers an isolated code interpreter for your LLM-generated code.

Our MCP server implementation wraps the AVM API and presents an endpoint to run arbitrary Python code in a trustless execution environment

Configure with Claude Desktop as below, or adapt as necessary for your MCP client. Get a free AVM API key in your [AVM Platform](https://platform.avm.codes).

```json
{
  "mcpServers": {
    "avm-server": {
      "command": "npx",
      "args": ["@avm-ai/avm-mcp"],
      "env": {
        "AVM_API_KEY": "your-api-key"
      }
    }
  }
}
```

The AVM MCP server provides the following tool to your LLM:

- `execute_code`: Executes arbitrary code safely on AVM's code interpreter API
