const NodeHLSServer = require('./hlsServer');
const config = {
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: 'media',
  }
};
 
let hlsServer = new NodeHLSServer(config)
hlsServer.run();