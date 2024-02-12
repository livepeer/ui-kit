import { promises as fs } from "fs";
import * as path from "path";
import { glob } from "glob";

const outputFile = "src/lib/components.ts";

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

  let exportsContent = "";

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const exportName = fileNameToExportName(file);
    // Create an export statement for each component
    exportsContent += `export const ${exportName} = \`${escapeComponentContent(
      content,
    )}\`;\n\n`;
  }

  await fs.writeFile(outputFile, exportsContent);
  console.log(`Components written to ${outputFile}`);
}

componentsToString().catch((e) => console.error(e));
