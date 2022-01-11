import * as core from '@serverless-devs/core';
import GenerateSymbolicLink from './generate-symbolic-link';
import { CatchableError } from "../utils/errors";
import { IWithProps } from './interface';
import { getBuildArtifactPath, genBuildLinkFilesListJSONPath } from './utils';

export { getBuildArtifactPath, genBuildLinkFilesListJSONPath, setBuildStatus, getBuildStatus } from './utils';

/**
 * build 之后热更的能力
 * @param props : {
  configDirPath: yaml 路径
  codeUri: 代码路径
  serviceName: 服务名称
  functionName: 函数名称
  excludeFiles: 忽略的路径
} */
export async function buildLink({
  configDirPath,
  codeUri,
  serviceName,
  functionName,
  excludeFiles,
}: IWithProps) {
  if (!codeUri) throw new CatchableError('The required parameter codeUri was not found');
  if (!serviceName) throw new CatchableError('The required parameter serviceName was not found');
  if (!functionName) throw new CatchableError('The required parameter functionName was not found');

  const vm = core.spinner('Generate symbolic link...');
  try {
    const baseDir = configDirPath || process.cwd();
    const artifactPath = getBuildArtifactPath(baseDir, serviceName, functionName);
    const buildFilesListJSONPath = genBuildLinkFilesListJSONPath(baseDir, serviceName, functionName);
    const generateSymbolicLink = new GenerateSymbolicLink(baseDir, codeUri, artifactPath, buildFilesListJSONPath, excludeFiles);
    await generateSymbolicLink.startGenerateLink();
    vm.stop();
  } catch (ex) {
    vm.fail();
    throw ex;
  }
}
