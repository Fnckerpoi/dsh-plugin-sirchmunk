---
name: sirchmunk-search
description: Search local files, documents, and unstructured data on disk using the Sirchmunk MCP tool. Use when searching documentation, parsing complex document formats (PDF, Word, Excel, PPTX, etc.), querying local knowledge bases, or locating codebase information by content and semantic meaning.
argument-hint: ["[query] [--mode fast|deep|filename] [--path <dir>] [--include <patterns>]"]
---

# Sirchmunk Knowledge Search

Retrieve knowledge and inspect unstructured documents across local directories using the Sirchmunk MCP search tool (`mcp__sirchmunk__sirchmunk_search`). Supports 100+ document formats (PDF, DOCX, XLSX, PPTX, Markdown, CSV, JSON, source code, text files) without pre-indexing or manual vector embedding.

## Workflow

### 1. Identify Search Goal and Select Mode

Select the search mode that matches the user's objective:

| Mode | Latency | When to use | Behavior |
|---|---|---|---|
| `FAST` | 2–5s | Specific fact lookup, single file verification, rapid query (Default) | 2-level keyword cascade & focused context sampling |
| `DEEP` | 10–30s | Cross-file synthesis, comprehensive analysis, architecture or rule audits | LLM-powered Monte Carlo sampling across multiple documents |
| `FILENAME_ONLY` | <1s | Locating files by filename pattern or path fragment | Pure path & filename pattern search without reading contents |

### 2. Prepare Parameters and Scope

Set boundaries to avoid scanning unnecessary files:

- **`query`** (required): Plain natural language question or focused search terms.
- **`paths`**: Specify absolute or relative paths. Defaults to current workspace directory if omitted.
- **`mode`**: `"FAST"`, `"DEEP"`, or `"FILENAME_ONLY"`.
- **`include`**: Glob array for target file types (e.g. `["*.md", "*.docx", "*.pdf"]`).
- **`exclude`**: Glob array to prune noisy directories (e.g. `["node_modules/**", "dist/**", ".git/**"]`).
- **`top_k_files`**: Number of top matching files to analyze (default `3`, up to `10` for broad inquiries).
- **`max_depth`**: Directory traversal depth (1–20, default `5`).

### 3. Execute MCP Tool

Call the MCP search tool:

```json
{
  "tool": "mcp__sirchmunk__sirchmunk_search",
  "parameters": {
    "query": "<user question or keywords>",
    "paths": ["<target directory or file>"],
    "mode": "FAST",
    "top_k_files": 3,
    "include": ["*.md", "*.pdf"]
  }
}
```

### 4. Synthesize Evidence and Cite Sources

- **Extract grounded evidence**: Answer strictly based on the extracted evidence and text fragments returned by Sirchmunk.
- **Cite file references**: Explicitly state which file paths and sections contain the retrieved facts so the user can verify them.
- **Highlight uncertainties**: If the retrieved documents do not fully answer the prompt, state the exact gaps.

### 5. Troubleshooting & Fallback

- **Connection error (`Search failed: Connection error`)**:
  - The local Sirchmunk backend service or container is not reachable.
  - Verify that the Sirchmunk service is running (default health endpoint: `http://localhost:8584/api/v1/health` or Docker container).
  - Verify that the MCP connector is configured and enabled in DSH settings.
- **No relevant results found**:
  - Broaden keywords (remove overly narrow terms).
  - Switch from `FAST` mode to `DEEP` mode for semantic multi-pass analysis.
  - Check whether `paths` or `include` filters were too restrictive.
