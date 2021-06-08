import express from 'express';
import http from 'http';
import path from 'path';

const port: number = 3000;

const modules = [
  {
    from: '/build/three.module.js',
    to: '../../node_modules/three/build/three.module.js',
  },
  {
    from: '/jsm/controls/OrbitControls',
    to: '../../node_modules/three/examples/jsm/controls/OrbitControls.js',
  },
  {
    from: '/jsm/loaders/GLTFLoader',
    to: '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js',
  },
  {
    from: '/jsm/utils/SkeletonUtils',
    to: '../../node_modules/three/examples/jsm/utils/SkeletonUtils.js',
  },
];

class App {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, '../client')));

    modules.map((m) =>
      app.use(m.from, express.static(path.join(__dirname, m.to)))
    );

    app.get('/', (_, res) => {
      res.send(
        '<html><body style="margin: 0"><script type="module" src="client.js"></script></body></html>'
      );
    });

    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}.`);
    });
  }
}

new App(port).Start();
