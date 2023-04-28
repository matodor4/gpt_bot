import axios from "axios";
import { createWriteStream } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg"




const __dirName = dirname(fileURLToPath(import.meta.url))
class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`)
            return new Promise((resolve, reject) => {
                ffmpeg(input)
                    .inputOption("-t 30")
                    .output(outputPath)
                    .on("end", () => resolve(outputPath))
                    .on("error", (err) => reject(err.message))
                    .run()
            })
        } catch(e) {

        }

    }

    async fetch(url, filename) {
        try {
            const oggPath = resolve(__dirName, "../voices/", `${filename}.ogg`)
            const response = await axios({
                method: "get",
                url,
                responseType: "stream",
            })

            return new Promise(resolve => {
                const writeStream = createWriteStream(oggPath)
                response.data.pipe(writeStream)
                writeStream.on("finish", () => resolve(oggPath))
            })

        } catch(e) {
            console.log("error while fetching ogg file", e.message)
        }
    }
}


export const ogg = new OggConverter()