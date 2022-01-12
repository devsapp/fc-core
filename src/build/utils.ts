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
export async function getBuildState(serviceName: string, functionName: string, sYaml: string) {
  const statusId = `${serviceName}-${functionName}-build`;
  const statusPath = path.join(sYaml || process.cwd(), '.s', 'fc-build');

  const buildState = await core.getState(statusId, statusPath) || {};
  if (buildState.status === 'unavailable') {
    const error = new CatchableError(`${serviceName}/${functionName} build status is unavailable.`, "Please re-execute 's build'");
    return { ...buildState, state: false, error };
  }

  return { ...buildState, state: true };
}

/**
 * 设置 build 的状态
 * @param serviceName 
 * @param functionName 
 * @param sYaml s.yaml 配置的地址，默认是 process.cwd()
 * @param status 设置的值 `available` | `unavailable`
 */
export async function setBuildState(serviceName: string, functionName: string, sYaml: string, value: { status: 'available' | 'unavailable', useLink?: boolean }) {
  const statusId = `${serviceName}-${functionName}-build`;
  const statusPath = path.join(sYaml || process.cwd(), '.s', 'fc-build');
  const buildState = await core.getState(statusId, statusPath) || { useLink: false };

  await core.setState(statusId, { ...buildState, ...value }, statusPath);
}
