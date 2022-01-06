import { jsyaml } from '@serverless-devs/core';
import * as path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * 获取 fc-default 所有的配置
 * @returns 
 */
export async function getConfigFromFile() {
  const defaultConfigFileObject = path.join(os.homedir(), '.s', '.fc.default.yaml');
  let yamlData = {};
  try {
    yamlData = await jsyaml.load(fs.readFileSync(defaultConfigFileObject, 'utf8'));
  } catch (e) {
    yamlData = { 'deploy-type': 'sdk' };
  }
  yamlData['deploy-type'] = process.env['s-default-deploy-type'] || process.env.s_default_deploy_type || yamlData['deploy-type'];
  yamlData['fc-endpoint'] = process.env['s-default-fc-endpoint'] || process.env.s_default_fc_endpoint || yamlData['fc-endpoint'];
  yamlData['enable-fc-endpoint'] = process.env['s-default-enable-fc-endpoint'] || process.env.s_default_enable_fc_endpoint || yamlData['enable-fc-endpoint'];
  yamlData['fc-cluster-ip'] = process.env['s-default-fc-cluster-ip'] || process.env.s_default_fc_cluster_ip || yamlData['fc-cluster-ip'];
  return yamlData;
}
