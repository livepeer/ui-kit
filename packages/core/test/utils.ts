import { ReadStream, createReadStream, statSync } from "fs";
import { resolve } from "path";

export function getSampleVideo(): { file: ReadStream; uploadSize: number } {
  const sampleFilePath = resolve(__dirname, "./sample.mp4");

  const { size } = statSync(sampleFilePath);
  const file = createReadStream(sampleFilePath);
  return { file, uploadSize: size };
}
