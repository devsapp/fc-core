import * as core from '@serverless-devs/core';
import OssClient from 'ali-oss';
// import path from 'path';
import { ICredentials } from '../interface';
import { CatchableError } from '../utils/errors';
import logger from '../utils/logger';

interface Opt {
  credentials?: ICredentials;
}

interface CertConfig {
  certName?: string;
  certificate: string;
  privateKey: string;
}

export class HttpsCertConfig {
  static async getCertContent(certConfig: CertConfig, opt?: Opt) {
    const { certificate, privateKey, certName } = certConfig;
    const privateContent = await this.getCertKeyContent(privateKey, opt);
    const certContent = await this.getCertKeyContent(certificate, opt);

    return {
      certName,
      certificate: certContent,
      privateKey: privateContent,
    }
  }

  static async getCertKeyContent(certKey: string = '', opt: Opt = {}): Promise<string> {
    // 支持直接传递：-----BEGIN RSA PRIVATE KEY---- sdddfdf----END RSA PRIVATE KEY-----
    if (certKey.startsWith('-')) {
      return certKey.trim();
    }

    // 支持 http:// 和 https://
    if (certKey.startsWith('http://') || certKey.startsWith('https://')) {
      return this.getHttpContent(certKey);
    }

    // 支持 oss oss://${region}/bucketName/objectName
    if (certKey.startsWith('oss://')) {
      return this.getOSSContent(certKey, opt);
    }

    try {
      return core.fse.readFileSync(certKey).toString().trim();
    } catch (ex) {
      throw new CatchableError(ex.message);
    }
  }

  static async getUserCertificateDetail(certId: number, opt: Opt = {}) {
    const { credentials } = opt;
    if (core.lodash.isEmpty(credentials)) {
      throw new CatchableError('You need to enter a key to get the information of the certificate');
    }
    const { AccessKeyID, AccessKeySecret, SecurityToken } = credentials;
    const client = new core.popCore({
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      // @ts-ignore
      securityToken: SecurityToken, // use STS Token
      endpoint: 'https://cas.aliyuncs.com',
      apiVersion: '2018-07-13'
    });
    const {
      Key: privateKey,
      Cert: certificate,
      Name: certName,
    } = await client.request('DescribeUserCertificateDetail', { CertId: certId }, { method: 'POST' });
    if (core.lodash.isEmpty(certName)) {
      throw new CatchableError(`Key information not found according to certId: ${certId}`);
    }
    return { privateKey, certificate, certName };
  }

  private static async getOSSContent(certKey: string, opt: Opt): Promise<string> {
    // get oss client options
    const ossPath = certKey.substring(6);
    const [region, bucketName, ...objectNameArr] = ossPath.split('/');
    const objectName = objectNameArr.join('/');
    logger.debug(`oss config: ${region}, ${bucketName}, ${objectName}`);
    if (!(region && bucketName && objectName)) {
      throw new CatchableError(`${certKey} does not meet expectations, e.g: oss://oss-cn-hangzhou/bucketName/objectName`);
    }
    const ossRegion = region.startsWith('oss-') ? region : `oss-${region}`;

    // gen oss client
    const { credentials } = opt;
    if (core.lodash.isEmpty(credentials)) {
      throw new CatchableError('You need to enter a key to get the content of OSS');
    }
    const { AccessKeyID, AccessKeySecret, SecurityToken } = credentials;
    const ossClient = new OssClient({
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      stsToken: SecurityToken,
      region: ossRegion,
      bucket: bucketName,
    });
    return (await ossClient.get(objectName))?.content?.toString();
  }

  private static async getHttpContent(certKey: string) {
    return await core.request(certKey, {
      hint: {
        loading: 'Getting privatekey and certificate...',
        success: '',
        error: 'Privatekey and certificate acquisition failed',
      },
      json: false,
    });
  }
}
