import { lodash, popCore as Pop } from '@serverless-devs/core';
import { ICredentials } from '../interface';

const TIMEOUT = 600 * 1000;
const { get, isEqual } = lodash;
const requestOption = {
  method: 'POST',
  formatParams: false,
};

export function makeNasClient(profile: ICredentials, region: string, { timeout } = { timeout: TIMEOUT }) {
  return new Pop({
    endpoint: `http://nas.${region}.aliyuncs.com`,
    apiVersion: '2017-06-26',
    accessKeyId: profile.AccessKeyID,
    accessKeySecret: profile.AccessKeySecret,
    // @ts-ignore
    securityToken: profile.SecurityToken,
    opts: { timeout },
  });
}

export async function checkNasMountTargetsExists(profile: ICredentials, payload: { region: string, mountTarget: string }) {
  const { region, mountTarget } = payload || {};
  const client = makeNasClient(profile, region);

  const result = await client.request('DescribeFileSystems', {}, requestOption);
  const fileSystems = get(result, 'FileSystems.FileSystem', []);
  for (const fileSystem of fileSystems) {
    const mountTargets = get(fileSystem, 'MountTargets.MountTarget', []);
    for (const { MountTargetDomain } of mountTargets) {
      if (isEqual(mountTarget, MountTargetDomain)) {
        return true;
      }
    }
  }
  return false;
}
