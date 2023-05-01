import { dirname, resolve } from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
const __dirName = dirname(fileURLToPath(import.meta.url));
export class FileDownloader {
    async Fetch(url, fileName) {
        try {
            const oggPath = resolve(__dirName, "../../voices/", `${fileName}.ogg`);
            console.log("path to create", oggPath);
            const response = await axios({
                method: "get",
                url,
                responseType: "stream",
            });
            console.log("request to whisper");
            return new Promise(resolve => {
                const writeStream = createWriteStream(oggPath);
                response.data.pipe(writeStream);
                writeStream.on("finish", () => resolve(oggPath));
            });
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
}
