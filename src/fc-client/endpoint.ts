import { CatchableError } from "../utils/errors";
import { getConfigFromFile } from '../default-config';

/**
 * 获取自定义 endpoint
 * @returns 
 */
export async function getEndpointFromFcDefault(): Promise<string | null> {
  const fcDefault = await getConfigFromFile();
  const fcEndpoint: string = fcDefault['fc-endpoint'];
  const enableFcEndpoint: any = fcDefault['enable-fc-endpoint'];
  if (fcEndpoint && (enableFcEndpoint === true || enableFcEndpoint === "true")) {
    return fcEndpoint;
  }
  return null;
}

/**
 * 检测内网自定义 endpoint
 * @param region 
 * @param accountId 
 * @param endpoint 
 * @returns 
 */
export function checkEndpoint(
  region: string,
  accountId: string,
  endpoint: string
): boolean {
  // 用户设置自定义 endpoint ，只有 https://${accountID}.${region}-internal.fc.aliyuncs.com 这一种格式
  if (endpoint.endsWith("-internal.fc.aliyuncs.com")) {
    const accountIdInEndpoint: string = extractAccountId(endpoint);
    const regionInEndpoint: string = extractRegion(endpoint);
    if (accountIdInEndpoint !== accountId) {
      throw new CatchableError(
        `Please make accountId: ${accountIdInEndpoint} in custom endpoint equal to accountId: ${accountId} you provided.`
      );
    }
    if (!regionInEndpoint.startsWith(region)) {
      throw new CatchableError(
        `Please make region: ${regionInEndpoint} in custom endpoint equal to accountId: ${region} you provided.`
      );
    }
  }
  return true;
}

/**
 * 提取 accountId
 * @param endpoint 
 * @returns 
 */
export function extractAccountId(endpoint: string): string | null {
  return extract(/^https?:\/\/([^.]+)\..+$/, endpoint);
}

/**
 * 提取 region
 * @param endpoint 
 * @returns 
 */
export function extractRegion(endpoint: string): string | null {
  return extract(/^https?:\/\/[^.]+\.([^.]+)\..+$/, endpoint);
}

function extract(regex: RegExp, endpoint: string): any {
  const matchs = endpoint.match(regex);
  if (matchs) {
    return matchs[1];
  }
  return null;
}
