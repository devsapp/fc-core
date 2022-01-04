import FC from "@alicloud/fc2";
import { CatchableError } from "../utils/errors";
import { checkEndpoint, getEndpointFromFcDefault } from "./endpoint";
import { InputProps } from "../utils/interface";
import logger from "../utils/logger";
import { getCredentials } from "../common";

const DEFAULT_TIMEOUT = 600 * 1000;

/**
 * 获取 fc client
 * @param {InputProps} inputs
 * @returns
 */
export async function makeFcClient(inputs: InputProps) {
  logger.debug(`input: ${JSON.stringify(inputs.props)}`);
  const region: string = inputs?.props?.region;
  const timeout: number = inputs?.props?.timeout;
  if (!region) {
    throw new CatchableError("Please provide region in your props.");
  }
  const { credentials } = await getCredentials(inputs);

  const endpointFromCredentials: string = credentials.endpoint;
  const endpointFromFcDefault: string = await getEndpointFromFcDefault();

  let endpoint: string = null;
  if (endpointFromCredentials) {
    // 优先使用 credentials 中的 endpoint
    if (
      !checkEndpoint(region, credentials?.AccountID, endpointFromCredentials)
    ) {
      return;
    }
    endpoint = endpointFromCredentials;
  } else if (endpointFromFcDefault) {
    if (!checkEndpoint(region, credentials?.AccountID, endpointFromFcDefault)) {
      return;
    }
    endpoint = endpointFromFcDefault;
  }
  if (endpoint) {
    logger.info(`Using endpoint ${endpoint}`);
  }
  return new FC(credentials.AccountID, {
    accessKeyID: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
    securityToken: credentials.SecurityToken,
    region,
    timeout: timeout * 1000 || DEFAULT_TIMEOUT,
    endpoint,
  });
}
