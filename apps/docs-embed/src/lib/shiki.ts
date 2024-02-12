import { getHighlighter } from "shiki/bundle/web";

export const codeToHtml = async ({ code }: { code: string }) => {
  const highlighter = await getHighlighter({
    themes: ["vitesse-black"],
    langs: ["tsx", "css"],
  });

  return highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "vitesse-black",
  });
};
