import path from 'path';
import { CatchableError } from '../utils/errors'
import * as core from '@serverless-devs/core';

/**
 * 生成 build-link 的文件结构路径
 * @param baseDir s.yaml 的路径
 * @param serviceName 服务名称
 * @param functionName 函数名称
 * @returns build-link 的文件结构路径
 */
export function genBuildLinkFilesListJSONPath(baseDir: string, serviceName: string, functionName: string) {
  return path.join(baseDir, '.s', 'fc-build-link', `${serviceName}-${functionName}-files_list.json`);
}

/**
 * 生成 build 产物的文件夹路径
 * @param baseDir s.yaml 的路径
 * @param serviceName 服务名称
 * @param functionName 函数名称
 * @returns
 */
export function getBuildArtifactPath(baseDir: string, serviceName: string, functionName: string) {
  return path.join(baseDir, '.s', 'build', 'artifacts', serviceName, functionName);
}

/**
 * 获取 build 的状态
 * @param serviceName 
 * @param functionName 
 * @param sYaml s.yaml 配置的地址，默认是 process.cwd()
 * @returns { status: boolean, error?: CatchableError }
 */
export async function getBuildStatus(serviceName: string, functionName: string, sYaml: string) {
  const statusId = `${serviceName}-${functionName}-build`;
  const statusPath = path.join(sYaml || process.cwd(), '.s', 'fc-build');

  const { status } = await core.getState(statusId, statusPath) || {};
  if (status === 'unavailable') {
    const error = new CatchableError(`${serviceName}/${functionName} build status is unavailable.Please re-execute 's build'`);
    return { status: false, error };
  }

  return { status: true };
}

/**
 * 设置 build 的状态
 * @param serviceName 
 * @param functionName 
 * @param sYaml s.yaml 配置的地址，默认是 process.cwd()
 * @param status 设置的值 `available` | `unavailable`
 */
export async function setBuildStatus(serviceName: string, functionName: string, sYaml: string, status: string) {
  const statusId = `${serviceName}-${functionName}-build`;
  const statusPath = path.join(sYaml || process.cwd(), '.s', 'fc-build');

  await core.setState(statusId, { status }, statusPath);
}
