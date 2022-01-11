import * as core from '@serverless-devs/core';
import _ from 'lodash';
import path from 'path';
import { isAuto } from '../common';
import { CatchableError } from '../utils/errors';

export class DeployCache {
  accountID: string;
  region: string;
  basePath: string;

  constructor(accountID: string, region: string, sYaml: string) {
    if (_.isNil(accountID)) {
      throw new CatchableError('Get cached data accountID cannot be empty');
    }
    if (_.isNil(region)) {
      throw new CatchableError('Get cached data region cannot be empty');
    }
    this.accountID = accountID;
    this.region = region;
    if (sYaml) {
      this.basePath = path.join(path.dirname(sYaml), '.s');
    }
  }

  async getYamlState(props: { serviceName: string; functionName: string; triggerNames?: string[]; customDomains?: string[] }) {
    const {
      serviceName,
      functionName,
      triggerNames,
      customDomains,
    } = props;
  
    const stateRes: any = {};
    if (serviceName) {
      const serviceStateId = DeployCache.genServiceStateID(this.accountID, this.region, serviceName);
      const serviceState = await core.getState(serviceStateId, this.basePath);
      stateRes.service = serviceState?.statefulConfig;

      if (functionName) {
        const functionStateId = DeployCache.genFunctionStateID(this.accountID, this.region, serviceName, functionName);
        const functionState = await core.getState(functionStateId, this.basePath);
        stateRes.function = functionState?.statefulConfig;

        if (!_.isEmpty(triggerNames)) {
          stateRes.triggerNames = [];
          for (const triggerName of triggerNames) {
            const triggerStateId = DeployCache.genTriggerStateID(this.accountID, this.region, serviceName, functionName, triggerName);
            const triggerState = await core.getState(triggerStateId, this.basePath);
            stateRes.triggerNames.push(triggerState?.statefulConfig);
          }
        }
      }
    }

    if (!_.isEmpty(customDomains)) {
      const genDomainProps = {
        accountID: this.accountID,
        region: this.region,
        serviceName,
        functionName,
      };
      stateRes.customDomains = [];
      for (const customDomain of customDomains) {
        const domainStateId = DeployCache.genDomainStateID(customDomain, genDomainProps);
        const domainState = await core.getState(domainStateId, this.basePath);
        stateRes.customDomains.push(domainState);
      }
    }

    return stateRes;
  }

  /**
   * 获取服务缓存的标示
   * @param serviceName 
   * @param accountID 
   * @param region 
   * @returns 
   */
  static genServiceStateID(accountID: string, region: string, serviceName: string): string {
    return `${accountID}-${region}-${serviceName}`;
  }

  /**
   * 获取函数缓存的标示
   * @param serviceName 
   * @param accountID 
   * @param region 
   * @param serviceName 
   * @param functionName 
   * @returns 
   */
  static genFunctionStateID(accountID: string, region: string, serviceName: string, functionName: string): string {
    return `${accountID}-${region}-${serviceName}-${functionName}`;
  }

  /**
   * 获取触发器缓存的标示
   * @param serviceName 
   * @param accountID 
   * @param region 
   * @param serviceName 
   * @param functionName 
   * @param triggerName 
   * @returns 
   */
  static genTriggerStateID(accountID: string, region: string, serviceName: string, functionName: string, triggerName: string): string {
    return `${accountID}-${region}-${serviceName}-${functionName}-${triggerName}`;
  }

  /**
   * 获取域名缓存的标示
   * @param domainName 
   * @returns 
   */
  static genDomainStateID(domainName: string, genDomainProps?: { accountID: string; region: string; serviceName: string; functionName: string; }): string {
    if (isAuto(domainName)) {
      const { accountID, region, serviceName, functionName } = genDomainProps;
      if (_.isNil(accountID) || _.isNil(region) || _.isNil(serviceName) || _.isNil(functionName)) {
        throw new CatchableError(``);
      }

      return `${functionName}.${serviceName}.${accountID}.${region}.fc.devsapp.net`;
    }
    return domainName;
  }
}

