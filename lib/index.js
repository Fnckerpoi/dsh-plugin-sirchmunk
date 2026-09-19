import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
export const name = 'dsh-plugin-sirchmunk';
const PROVIDER_NAME = 'dsh-plugin-sirchmunk';
const SKILL_NAME = 'sirchmunk-search';
const DESCRIPTION = 'Search local files, documents, and unstructured data on disk using the Sirchmunk MCP tool. Use when searching documentation, parsing complex document formats (PDF, Word, Excel, PPTX, etc.), querying local knowledge bases, or locating codebase information by content and semantic meaning.';
function registerBundledSkills(ctx) {
    if (!ctx.skills?.registerProvider) {
        return;
    }
    const skillFileUrl = new URL('../skills/sirchmunk-search/SKILL.md', import.meta.url);
    const resourceDirectory = fileURLToPath(new URL('../skills/sirchmunk-search/', import.meta.url));
    const candidate = {
        name: SKILL_NAME,
        description: DESCRIPTION,
        invocation: {
            modelInvocable: true,
            userInvocable: true,
        },
        provider: PROVIDER_NAME,
        source: 'bundled',
        rank: 600,
        locator: skillFileUrl,
        resourceBase: {
            kind: 'directory',
            path: resourceDirectory,
        },
    };
    const provider = {
        name: PROVIDER_NAME,
        list: () => Promise.resolve([candidate]),
        async get(selected) {
            if (selected.name !== SKILL_NAME)
                return undefined;
            try {
                const content = await readFile(skillFileUrl, 'utf8');
                return {
                    name: candidate.name,
                    description: candidate.description,
                    invocation: candidate.invocation,
                    provider: candidate.provider,
                    source: candidate.source,
                    resourceBase: candidate.resourceBase,
                    content,
                };
            }
            catch (err) {
                ctx.logger?.warn?.(`[dsh-plugin-sirchmunk] Failed to load bundled skill: ${String(err)}`);
                return undefined;
            }
        },
    };
    ctx.skills.registerProvider(() => provider);
    ctx.logger?.info(`[dsh-plugin-sirchmunk] Registered bundled skill: ${SKILL_NAME}`);
}
export function apply(ctx) {
    ctx.logger?.info('[dsh-plugin-sirchmunk] Host plugin applied');
    registerBundledSkills(ctx);
}
