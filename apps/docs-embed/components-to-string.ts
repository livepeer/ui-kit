import { promises as fs } from "node:fs";
import * as path from "node:path";
import { glob } from "glob";

function escapeComponentContent(content: string): string {
  return content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
    .replace(/\"use client\";/g, "")
    .trim();
}

function fileNameToExportName(fileName: string): string {
  const baseName = path.basename(fileName, path.extname(fileName));
  return baseName.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[0-9]/, "_$&");
}

async function componentsToString() {
  const files = await glob("src/components/**/*.ts*");
  const groupedFiles: Record<string, string[]> = {};

  for (const file of files) {
    const dirname = path.dirname(file).split(path.sep).pop();

    if (dirname) {
      if (!groupedFiles[dirname]) {
        groupedFiles[dirname] = [];
      }
      groupedFiles[dirname].push(file);
    }
  }

  for (const [dirname, files] of Object.entries(groupedFiles)) {
    let exportsContent = "";

    for (const file of files) {
      const content = await fs.readFile(file, "utf8");
      const exportName = fileNameToExportName(file);
      exportsContent += `export const ${exportName} = \`${escapeComponentContent(
        content,
      )}\`;\n\n`;
    }

    const outputFileName = `src/lib/${dirname}-components.ts`;
    await fs.writeFile(outputFileName, exportsContent);
    console.log(`Components for ${dirname} written to ${outputFileName}`);
  }
}

componentsToString().catch((e) => console.error(e));
