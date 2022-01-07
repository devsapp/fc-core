import path from 'path';

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