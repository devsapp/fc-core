import { HttpsCertConfig } from '../../../src'

async function testGetCertContent() {
  const getStitic = await HttpsCertConfig.getCertContent({
    certName: 'test',
    privateKey: '-----BEGIN RSA PRIVATE KEY----\nsdddfdf\n----END RSA PRIVATE KEY-----',
    certificate: '-----BEGIN CERTIFICATE----\nsdfdfdfdf\n----END CERTIFICATE-----',
  });
  console.log('getStitic:: \n', getStitic, '\n\n');

  const getHttp = await HttpsCertConfig.getCertContent({
    certName: 'test',
    privateKey: 'https://wss-demo.oss-cn-qingdao.aliyuncs.com/test-cert/a',
    certificate: 'http://wss-demo.oss-cn-qingdao.aliyuncs.com/test-cert/b',
  });
  console.log('getHttp:: \n', getHttp, '\n\n');

  const getFile = await HttpsCertConfig.getCertContent({
    certName: 'test',
    privateKey: './file/c',
    certificate: './file/d',
  });
  console.log('getFile:: \n', getFile, '\n\n');

  // const getOss = await HttpsCertConfig.getCertContent({
  //   certName: 'test',
  //   privateKey: 'oss://cn-qingdao/wss-demo/test-cert/c',
  //   certificate: 'oss://oss-cn-qingdao/wss-demo/test-cert/d',
  // }, {
  //   credentials: {
  //     AccessKeyID: 'support ak',
  //     AccessKeySecret: 'support sk',
  //   },
  // });
  // console.log('getOss:: \n', getOss);
}

testGetCertContent();
