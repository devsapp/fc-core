import _ from "lodash";
import FC from "@alicloud/fc2";
import * as core from "@serverless-devs/core";
import { CatchableError } from "../utils/errors";
import { checkEndpoint, getEndpointFromFcDefault } from "./endpoint";
import logger from "../utils/logger";
import { MakeFcClientInput } from "../utils/interface";
import { ICredentials } from "../interface";
import "./fc-client";
import Acc from "@serverless-devs/acc/commands/run";
import path from "path";
import os from "os";
export { getEndpointFromFcDefault } from "./endpoint";

const { fse: fs } = core;
const DEFAULT_TIMEOUT = 600;
const ALIYUN_CONFIG_FILE = path.join(os.homedir(), ".aliyun", "config.json");

/**
 * 获取密钥，包含s和aliyun-cli
 * @param access: 密钥别名
 * @returns { AccountID: string, AccessKeyID: string, AccessKeySecret: string, SecurityToken?: string}
 */

export async function getCredentialWithAcc(access: string) {
  const data = await core.getCredentialAliasList();
  if (_.includes(data, access)) {
    return await core.getCredential(access);
  }
  const configPath = process.env.ALIBABACLOUD_CONFIG || ALIYUN_CONFIG_FILE;
  if (fs.existsSync(configPath)) {
    let accData;
    try {
      accData = await new Acc().run([]);
    } catch (error) {}
    if (accData?.AccessKeyID && accData?.AccessKeySecret) {
      const stockData = core.getConfig("acc");
      const findObj = _.find(
        stockData,
        (o) => o.AccessKeyID === accData.AccessKeyID
      );
      if (findObj) {
        accData.AccountID = findObj.AccountId;
        return accData;
      }
      const info: any = await core.getAccountId(accData);
      const tmp = [
        {
          AccountId: info.AccountId,
          AccessKeyID: accData.AccessKeyID,
        },
      ];
      core.setConfig("acc", stockData ? _.concat(stockData, tmp) : tmp);
      accData.AccountID = info.AccountId;
      return accData;
    }
  }
  return await core.getCredential(access);
}

/**
 * 获取 fc client
 * @param props: { access: string; region: string; timeout?: number; credentials?: ICredentials; }
 * @returns
 */
export async function makeFcClient(props: MakeFcClientInput) {
  logger.debug(`input: ${JSON.stringify(props)}`);
  const region: string = props.region;
  const timeout: number = (props.timeout || DEFAULT_TIMEOUT) * 1000;
  if (!region) {
    throw new CatchableError("Please provide region in your props.");
  }
  logger.debug(`make fc client ${timeout}ms`);

  let credentials: ICredentials;
  if (_.isEmpty(props.credentials)) {
    const credentialRes: any = await getCredentialWithAcc(props.access);
    credentials = {
      AccountID: credentialRes?.AccountID,
      AccessKeyID: credentialRes?.AccessKeyID,
      AccessKeySecret: credentialRes?.AccessKeySecret,
      SecurityToken: credentialRes?.SecurityToken,
      endpoint: credentialRes?.endpoing,
    };
  } else {
    credentials = props.credentials;
  }

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
    logger.debug(`Using endpoint ${endpoint}`);
  }
  return new FC(credentials.AccountID, {
    accessKeyID: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
    securityToken: credentials.SecurityToken,
    region,
    timeout,
    endpoint,
  });
}
