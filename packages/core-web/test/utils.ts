import fs, { ReadStream } from "fs";
import path from "path";

export function getSampleVideo(): { file: ReadStream; uploadSize: number } {
  const sampleFilePath = path.resolve(__dirname, "./sample.mp4");

  const { size } = fs.statSync(sampleFilePath);
  const file = fs.createReadStream(sampleFilePath);
  return { file, uploadSize: size };
}
