import { dirname, resolve } from "path";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
export class Converter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path);
    }
    async ToMp3(inPath, outPath) {
        try {
            const outputPath = resolve(dirname(inPath), `${outPath}.mp3`);
            return new Promise((resolve, reject) => {
                ffmpeg(inPath)
                    .inputOption("-t 30")
                    .output(outputPath)
                    .on("end", () => resolve(outputPath))
                    .on("error", (err) => reject(err.message))
                    .run();
            });
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
}
