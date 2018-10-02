const express = require('express');
const router = express.Router();

const Helpers = require('./helpers');

let playList = __dirname + '/media/playlist.m3u8';
let playlistInfo = Helpers.getSegmentsDuration(playList);
let startTime = Date.now();

router.get('/playlist.m3u8', function(req, res, next) {
    let now = Date.now();
    let delta = (now - startTime) / 1000;
    let totalLoops = Math.floor(delta / playlistInfo.totalDuration);
    let deltaInLoop = delta - (playlistInfo.totalDuration * totalLoops);
    let sequence = totalLoops * playlistInfo.segments.length;
    let currentSegment = 0;
    let segments = [];
    let m3u8Template, videoPath, _segment; 
    const playListLen = playlistInfo.segments.length;           
    for(let i = 0; i < playListLen; i++) {
        _segment = playlistInfo.segments[i];                
        deltaInLoop -= _segment; 
        if(deltaInLoop > 0) {
            currentSegment++;
            continue;
        }                
        let fileSeq = 0;
        for (let j = 0; j < 4; j++) {                    
            if (i + j > playListLen - 1) {
                fileSeq = (i + j) - (playListLen); 
            } else {
                fileSeq = i + j;
            }                                                
            videoPath = `,\n${fileSeq}.ts`;
            let fileSegment = playlistInfo.segments[fileSeq];
            segments.push('#EXTINF:' + fileSegment + videoPath);
        }
        break;
    }
    m3u8Template = '#EXTM3U\n#EXT-X-TARGETDURATION:7\n#EXT-X-VERSION:3\n#EXT-X-MEDIA-SEQUENCE:'+(sequence+currentSegment)+'\n#EXT-X-ALLOW-CACHE:NO';
    m3u8Template += "\n"+segments.join('\n')+"\n";
  
    res.contentType('application/vnd.apple.mpegurl');
    res.send(m3u8Template);
    let end = Date.now();
});

exports.router = router;