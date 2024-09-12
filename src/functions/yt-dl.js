const { exec } = require('child_process');
const path = require('path');
const ytdl = require('ytdl-core');
const youtubesearchapi = require("youtube-search-api");
const fs = require("fs")





//* download video

function downloadVideo(ytDlpCommand) {
    return new Promise((resolve, reject) => {
        exec(ytDlpCommand, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing yt-dlp: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`yt-dlp stderr: ${stderr}`);
            }

            console.log(`yt-dlp output: ${stdout}`);
            resolve(stdout);
        });
    });
}

//*  Function to remove "src\" from the file path

function removeSrcDirectory(filePath) {
    const srcString = "src\\functions\\";
    if (filePath.includes(srcString)) {
        return filePath.replace(srcString, '');
    }
    return filePath;
}


module.exports = async function youtbeDownload(message, client, MessageMedia) {
    let videoUrl = message.body.slice(10);
    const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
    const ytDlpCommand = `"${ytDlpPath}" -f 139 ${videoUrl}`;
    await client.sendMessage(message.from, "Downloading please wait ⏳ ...")


    try {
        // Wait for the video to download
        await downloadVideo(ytDlpCommand);

        // Get video details after download
        const videoId = ytdl.getVideoID(videoUrl);
        const response = await youtubesearchapi.GetVideoDetails(videoId);

        const oldPath = path.join(__dirname, response.title + " " + `[${videoId}]` + ".m4a");
        const newPath = path.join(__dirname, response.title + ".txt");

        console.log(removeSrcDirectory(oldPath));


        // Rename the file
        fs.rename(removeSrcDirectory(oldPath), newPath, (err) => {
            if (err) {
                console.error('Error renaming the file:', err);
            } else {
                console.log('File renamed successfully!');

                // Send the renamed file as a message
                const mediaPath = MessageMedia.fromFilePath(newPath);
                const media = new MessageMedia("text/plain", mediaPath.data, response.title + ".mp3")


                try {
                    const result = client.sendMessage(message.from, media);
                    console.log('Message sent successfully:');
                    fs.unlink(newPath, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                        } else {
                            console.log('File deleted successfully!');
                        }
                    });

                } catch (error) {
                    console.error('Something happened file has been downloaded successfully  but can not be sent ');
                }

            }
        });

    } catch (error) {
        client.sendMessage(message.from, "Sorry Something wrong happened and the Video can not be downloaded")
    }

}
