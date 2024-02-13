import { getHighlighter } from "shiki/bundle/web";

const highlighterPromise = getHighlighter({
  themes: ["vitesse-black"],
  langs: ["tsx", "css"],
});

export const codeToHtml = async ({ code }: { code: string }) => {
  const highlighter = await highlighterPromise;

  return highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "vitesse-black",
  });
};
