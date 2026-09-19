import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import process from 'node:process';
import ts from 'typescript';

const libDirectory = new URL('../lib/', import.meta.url);
const temporaryDirectory = new URL('../lib/.client-build/', import.meta.url);
const temporaryClient = new URL('../lib/.client-build/client.cjs', import.meta.url);
const clientOutput = new URL('../lib/client.js', import.meta.url);
const hostSource = new URL('../src/index.ts', import.meta.url);
const hostOutput = new URL('../lib/index.js', import.meta.url);

rmSync(libDirectory, { recursive: true, force: true });
mkdirSync(libDirectory, { recursive: true });

execFileSync('npm', ['run', 'build:client'], {
  cwd: new URL('..', import.meta.url),
  stdio: 'inherit',
  env: process.env,
});

const bundledClient = readFileSync(temporaryClient, 'utf8')
  .replace(/^['\"]use strict['\"];?\s*/, '')
  .trim();

const wrappedClient = `window.__ModuleLoader__.load({
  id: 'dsh-plugin-sirchmunk',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

${bundledClient}

    return module.exports;
  }
});
`;

writeFileSync(clientOutput, wrappedClient);
rmSync(temporaryDirectory, { recursive: true, force: true });

const hostResult = ts.transpileModule(readFileSync(hostSource, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: 'src/index.ts',
  reportDiagnostics: true,
});

const hostErrors = (hostResult.diagnostics ?? []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);

if (hostErrors.length > 0) {
  throw new Error(ts.formatDiagnostics(hostErrors, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  }));
}

writeFileSync(hostOutput, hostResult.outputText);
