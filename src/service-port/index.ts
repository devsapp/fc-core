import express from 'express';
import { exec } from 'child_process';
import { lodash } from '@serverless-devs/core';
import logger from '../utils/logger';
import { CatchableError } from '../utils/errors';

interface Context {
  port: number; // 端口号
  callback: Function; // 回掉函数
  host?: string; // 服务器地址，默认是 localhost
  openBrowser?: boolean; // 是否打开浏览器
  count?: number; // 端口冲突重试次数
}

/**
 * 
 * @param context 
 *         port: number; // 端口号
 *         callback: Function; // 回掉函数
 *         host?: string; // 服务器地址，默认是 localhost
 *         openBrowser?: boolean; // 是否打开浏览器
 *         count?: number; // 端口冲突重试次数
 * @returns 
 */
export default async function startExpressService(context: Context) {
  const {
    port,
    callback,
    host = 'localhost',
    openBrowser,
    count = 5,
  } = context;
  if (!port) {
    throw new CatchableError('Start service port must be set');
  }
  if (lodash.isFunction(callback)) {
    throw new CatchableError('The start service port callback parameter must be a function');
  }
  const app = express();
  callback(app)

  let counter = 0;
  let server;
  const listen = () => {
    const caProt = port + counter;
    server = app.listen(caProt, () => {
      const uri = `http://${host}:${caProt}`;

      logger.info(`Getting domain: ${uri}, 请用浏览器访问Uri地址进行查看`);

      if (openBrowser) {
        switch (process.platform) {
          case 'darwin':
            exec(`open ${uri}`);
            break;
          case 'win32':
            exec(`start ${uri}`);
            break;
          case 'linux':
            exec(`xdg-open ${uri}`);
            break;
          default:
            exec(`open ${uri}`);
        }
      }
    });
    counter += 1;

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        if (counter < count) {
          listen();
        } else {
          throw e;
        }
      }
    });
  };

  listen();

  return {
    server,
    stop: () => server.close(),
  }
};
