import * as fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import { commandExists } from './utils';

/**
 * 检查环境是否安装python，java，nodejs等语言环境
 * @param {string} runtime
 * @returns {[result, details]}
 */
export async function checkLanguage(
  runtime: string
): Promise<[boolean, string]> {
  let result = true;
  let details = '';

  if (runtime.includes('python')) {
    if (!commandExists('pip')) {
      result = false;
      details += '- pip not installed.\n';
    } else {
      details += `- ${execSync('pip --version').toString()}`;
    }

    if (!commandExists(runtime)) {
      result = false;
      details += `- ${runtime} not installed.\n`;
    } else {
      details += `- python ${execSync(
        `${runtime} -c 'import platform; print(platform.python_version())'`
      )
        .toString()
        .trim()}`;
    }
  }

  if (runtime.includes('java')) {
    if (!commandExists('mvn')) {
      result = false;
      details += '- maven not installed.\n';
    } else {
      details += `- ${execSync('mvn --version')
        .toString()
        .split('\n')[0]
        .replace(/\x1b|\[m|\[1m/g, '')}\n`;
    }

    if (!commandExists('java')) {
      result = false;
      details += `- ${runtime} not installed.\n`;
    } else {
      const javaCode =
        'class test {public static void main(String args[]) {System.out.print(Double.parseDouble(System.getProperty("java.specification.version")));}}';
      const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'foo-'));
      const javaSourceFilePath = path.join(folder, 'test.java');
      const javaClassFilePath = path.join(folder, 'test.class');
      fs.writeFileSync(javaSourceFilePath, javaCode);

      const version = execSync(
        `javac ${javaSourceFilePath} && java -classpath ${folder} test`
      ).toString();
      if (runtime.match(`java${version.split('.')[0]}`)) {
        details += `- java ${version}`;
      } else {
        details += `Required ${runtime}, found java ${version}`;
      }
      fs.unlinkSync(javaClassFilePath);
      fs.unlinkSync(javaSourceFilePath);
    }
  }

  if (runtime.includes('node')) {
    let version = '';
    if (!commandExists('node')) {
      result = false;
      details += `${runtime} not installed.\n`;
    } else {
      version = execSync('node -v').toString().trim();
      const num = runtime.replace('nodejs', '');
      if (!version.match(new RegExp(`v${num}.`))) {
        result = false;
        details += `Required ${runtime}, found ${version}\n`;
      } else {
        details += `- nodejs: ${version}`;
      }
    }
  }

  return [result, details];
}

/**
 * 判断是否是镜像运行时
 * @param runtime 
 * @returns 
 */
export function isCustomContainerRuntime(runtime: string): boolean {
  return runtime === 'custom-container';
}

/**
 * 判断是否是自定义运行时
 * @param runtime 
 * @returns 
 */
export function isCustomRuntime(runtime: string): boolean {
  return runtime === 'custom';
}

/**
 * 判断配置项是否是 auto
 * @param runtime 
 * @returns 
 */
export function isAuto(config: string): boolean {
  return config === 'Auto' || config === 'auto';
}

/**
 * domain auto 生成域名的规则
 * @param uid 用户主账号 id
 * @param region
 * @param serviceName 
 * @param functionName 
 * @returns 
 */
export function genDomainName(uid: string, region: string, serviceName: string, functionName: string) {
  return `${functionName}.${serviceName}.${uid}.${region}.fc.devsapp.net`.toLocaleLowerCase();
}

