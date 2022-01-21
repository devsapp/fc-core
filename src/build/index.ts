import * as core from '@serverless-devs/core';
import GenerateSymbolicLink from './generate-symbolic-link';
import { CatchableError } from "../utils/errors";
import { getBuildArtifactPath, genBuildLinkFilesListJSONPath, getBuildState, isInterpretedLanguage } from './utils';
import path from 'path';

export {
  getBuildArtifactPath,
  genBuildLinkFilesListJSONPath,
  setBuildState,
  getBuildState,
  isInterpretedLanguage,
} from './utils';

interface IWithProps {
  configDirPath: string;
  codeUri: string;
  runtime: string;
  serviceName: string;
  functionName: string;
  excludeFiles?: string[];
}

/**
 * build 之后热更的能力
 * @param props : {
  configDirPath: yaml 路径
  codeUri: 代码路径
  serviceName: 服务名称
  functionName: 函数名称
  excludeFiles: 忽略的路径
}
 * @param checkBuildState 检测 build 的状态，默认检测（true）
*/
export async function buildLink({
  configDirPath,
  codeUri,
  runtime,
  serviceName,
  functionName,
  excludeFiles,
}: IWithProps, checkBuildState = true) {
  if (!codeUri) throw new CatchableError('The required parameter codeUri was not found');
  if (!serviceName) throw new CatchableError('The required parameter serviceName was not found');
  if (!functionName) throw new CatchableError('The required parameter functionName was not found');

  const buildState = await getBuildState(serviceName, functionName, configDirPath);
  if (checkBuildState && buildState.error) {
    throw buildState.error;
  }

  // 如果不是解释性语言，跳出 build link
  if (!isInterpretedLanguage(runtime, path.join(configDirPath, codeUri))) { return; }

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
