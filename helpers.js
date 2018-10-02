const fs = require('fs');
module.exports = {
    maxSegmentsInPlaylist: 4,
    getSegmentsDuration: function (file) {
        let data = fs.readFileSync(file, 'utf-8');
        let re = /EXTINF:([\d\.]+),/gi;
        let segments = [],
            duration = 0,
            found;
        while (found = re.exec(data)) {
            segments.push(found[1]);
            duration += parseFloat(found[1]);
        }
        return {
            totalDuration: duration,
            segments: segments
        };
    }
}