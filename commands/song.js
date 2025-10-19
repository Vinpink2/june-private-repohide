/*
const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

const AXIOS_DEFAULTS = {
	timeout: 60000,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Accept': 'application/json, text/plain, /*'
	}
};

async function tryRequest(getter, attempts = 3) {
	let lastError;
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await getter();
		} catch (err) {
			lastError = err;
			if (attempt < attempts) {
				await new Promise(r => setTimeout(r, 1000 * attempt));
			}
		}
	}
	throw lastError;
}

async function getIzumiDownloadByUrl(youtubeUrl) {
	const apiUrl = `${encodeURIComponent(youtubeUrl)}&format=mp3`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	if (res?.data?.result?.download) return res.data.result;
	throw new Error('Izumi youtube?url returned no download');
}

async function getIzumiDownloadByQuery(query) {
	const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube-play?query=${encodeURIComponent(query)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	if (res?.data?.result?.download) return res.data.result;
	throw new Error('Izumi youtube-play returned no download');
}

async function getOkatsuDownloadByUrl(youtubeUrl) {
	const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
	const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
	// Okatsu response shape: { status, creator, title, format, thumb, duration, cached, dl }
	if (res?.data?.dl) {
		return {
			download: res.data.dl,
			title: res.data.title,
			thumbnail: res.data.thumb
		};
	}
	throw new Error('Okatsu ytmp3 returned no download');
}

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
            await sock.sendMessage(chatId, { text: 'Usage: .song <song name or YouTube link>' }, { quoted: message });
            return;
        }

        let video;
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
			video = { url: text };
        } else {
			const search = await yts(text);
			if (!search || !search.videos.length) {
                await sock.sendMessage(chatId, { text: 'No results found.' }, { quoted: message });
                return;
            }
			video = search.videos[0];
        }

        // Inform user
        await sock.sendMessage(chatId, {
          //  image: { url: video.thumbnail },
            caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp}`
        }, { quoted: message });

		// Try Izumi primary by URL, then by query, then Okatsu fallback
		let audioData;
		try {
			// 1) Primary: Izumi by youtube url
			audioData = await getIzumiDownloadByUrl(video.url);
		} catch (e1) {
			try {
				// 2) Secondary: Izumi search by query/title
				const query = video.title || text;
				audioData = await getIzumiDownloadByQuery(query);
			} catch (e2) {
				// 3) Fallback: Okatsu by youtube url
				audioData = await getOkatsuDownloadByUrl(video.url);
			}
		}

		await sock.sendMessage(chatId, {
			audio: { url: audioData.download || audioData.dl || audioData.url },
			mimetype: 'audio/mpeg',
			fileName: `${(audioData.title || video.title || 'song')}.mp3`,
			ptt: false
		}, { quoted: message });
		
		//sucess react
		
		await sock.sendMessage(chatId, {
            react: { text: '✔️', key: message.key }
        });

    } catch (err) {
        console.error('Song command error:', err);
        await sock.sendMessage(chatId, { text: '❌ Failed to download song.' }, { quoted: message });
        // err react
        await sock.sendMessage(chatId, {
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = songCommand;
*/

//new song API 

const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "What song do you want to download?"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "No songs found!"
            });
        }

        // Send loading message
        await sock.sendMessage(chatId, {
            text: "_Please wait your download is in progress_"
        });

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://api.goodnesstechhost.xyz/download/youtube/audio?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.download_url) {
            return await sock.sendMessage(chatId, { 
                text: "Failed to fetch audio from the API. Please try again later."
            });
        }

        const audioUrl = data.result.download_url;
        const title = data.result.title;

        // Send the audio
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: message });
        
        //successful react ✔️
       await sock.sendMessage(chatId, { react: { text: '✔️', key: message.key } 
        });

    } catch (error) {
        console.error('Error in song2 command:', error);
        await sock.sendMessage(chatId, { 
            text: "Download failed. Please try again later."
        });
        
        //err react ❌
            await sock.sendMessage(chatId, {
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = playCommand; 

/*Powered by June-md*
*Credits to Keith MD*`*/







