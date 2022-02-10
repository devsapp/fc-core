import fs from 'fs';
import { CatchableError } from "../utils/errors";

/**
 * 判断文件的结尾信息
 * @param filePath 文件路径
 * @returns 
 */
export async function getFileEndOfLineSequence(filePath: string): Promise<'CR' | 'LF' | 'CRLF' | 'NA' | CatchableError> {
  return await new Promise((resolve) => {
    const err = new CatchableError(`${filePath}: No such file or directory`);
    try {
      const fsStat = fs.statSync(filePath);
      if (!fsStat.isFile()) {
        return resolve(err); 
      }
    } catch(_ex) {
      return resolve(err);
    }

    let tentativePreviousString;
    let tentativeEndingType;
    let ran = false;

    const reader = fs.createReadStream(filePath);
    const returneds = {
      '\r': 'CR',
      '\n': 'LF',
      '\r\n': 'CRLF',
    };
    reader.on('data', function(buffer) {
      if (!ran) {
        const str = (tentativePreviousString || '') + buffer.toString();
        const matched = str.match(/\r\n|\r|\n/);
        const returned = returneds[matched[0]];
        // 处理当前缓冲区在 CRLF 的 CR 和 LF 之间结束的情况
        if (matched && returned === 'CR') {
          // 确保 CR 后跟字符串结尾以外的其他内容
          if (!str.match(/\r./)) {
            tentativePreviousString = str;
            tentativeEndingType = 'CR';
            return;
          }
        }
        if (matched) {
          ran = true;
          reader.destroy();
          resolve(returned);
        }
      }
    });

    reader.on('end', function(_buffer) {
      if (!ran) {
        ran = true;
        resolve(tentativeEndingType || 'NA');
      }
    });
  });
}
