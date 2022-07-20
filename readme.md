## FC-Core 方法通用相关文档

- [CatchableError](#CatchableError)：提示性错误
- [DeployCache](#DeployCache)： deploy 缓存相关
- [HttpsCertConfig](#HttpsCertConfig)：处理 https 证书
- [IMAGE_VERSION](#IMAGE_VERSION)：镜像的版本
- [alicloudFc2](#alicloudFc2)：`@alicloud/fc2` SDK
- [buildLink](#buildLink)：buildLink build 之后热更的能力
- [checkDocker](#checkDocker)：检查 Docker 环境
- [checkLanguage](#checkLanguage)：检查本地是否存在相关语言的环境
- [cleanUselessImagesByTag](#cleanUselessImagesByTag)：清理无效镜像
- [commandExists](#commandExists)：验证命令是否存在
- [formatterOutput](#formatterOutput)：输出规范
- [genBuildLinkFilesListJSONPath](#genBuildLinkFilesListJSONPath)：获取热更的能力的缓存文件地址
- [genContainerResourcesLimitConfig](#genContainerResourcesLimitConfig)：获取容器资源限制配置
- [genDomainName](#genDomainName)：domain auto 生成域名的规则
- [getBuildArtifactPath](#getBuildArtifactPath)：获取 build 的 use-docker 产物文件夹路径
- [getBuildState](#getBuildState)：获取 build 的状态
- [setBuildState](#setBuildState)：设置 build 的状态
- [getConfigFromFile](#getConfigFromFile)：获取 fc-defualt 的配置
- [getEndpointFromFcDefault](#getEndpointFromFcDefault)：获取 fc 的自定义 endpoint
- [makeFcClient](#makeFcClient)：获取 fc 客户端
- [getFileEndOfLineSequence](#getFileEndOfLineSequence)：判断文件的结尾信息
- [isCustomRuntime](#isCustomRuntime)：判断是否是自定义运行时
- [isCustomContainerRuntime](#isCustomContainerRuntime)：判断是否是自定义镜像运行时
- [isAuto](#isAuto)：判断配置是否是 auto
- [isDockerToolBox](#isDockerToolBox)：是不是虚拟机的 docker 环境
- [isInterpretedLanguage](#isInterpretedLanguage)：判断是否是解释性语言
- [preExecute](#preExecute)：检查 Docker 环境并清理无效镜像
- [pullImageIfNeed](#pullImageIfNeed)：是否需要拉取镜像
- [resolveRuntimeToDockerImage](#resolveRuntimeToDockerImage)：获取 docker 镜像的地址

### isInterpretedLanguage

判断是否是解释性语言

示例

```
isInterpretedLanguage(runtime: string, codeUri: string))
```

返回值：`boolean`

### getFileEndOfLineSequence

判断文件的结尾信息

示例

```
await getFileEndOfLineSequence(filePath: string);
```

返回值 `Promise<'CR' | 'LF' | 'CRLF' | 'NA' | CatchableError>`

### commandExists

验证命令是否存在，基于 [command-exists](https://www.npmjs.com/package/command-exists) 能力

```
commandExists('mvn')
```

### alicloudFc2

抛出 `@alicloud/fc2` SDK

### IMAGE_VERSION

镜像的版本（常量），可以通过环境变量 `FC_DOCKER_VERSION` 控制

### HttpsCertConfig

处理 https 证书

#### HttpsCertConfig.getCertContent 获取证书内容

```
interface Opt {
  credentials?: ICredentials;
}

interface CertConfig {
  certName?: string;
  certificate: string;
  privateKey: string;
}

await HttpsCertConfig.getCertContent(certConfig: CertConfig, opt?: Opt)
```

返回值

```
{
  certName: string;
  certificate: string;
  privateKey: string;
}
```

#### HttpsCertConfig.getUserCertificateDetail 从 CAS 获取 https 的证书内容

```
interface Opt {
  credentials?: ICredentials;
}
await HttpsCertConfig.getCertContent(certId: number, opt?: Opt)
```

返回值

```
{
  certName: string;
  certificate: string;
  privateKey: string;
}
```

### CatchableError

提示性错误

入参

```
tips: string;
message: string;
```

示例

```
throw new CatchableError("Please provide region in your props.");
```

### resolveRuntimeToDockerImage

获取 docker 镜像的地址

入参：

```
/**
 * @param runtime 函数计算运行时
 * @param isBuild? 是否是执行 build
 */
```

### pullImageIfNeed

是否需要拉取镜像

入参：

```
/**
 * @param docker : dockerode 的实例
 * @param imageName : docker 镜像的地址
 */
```

返回值 `undefined`

### preExecute

检查 Docker 环境并清理无效镜像

入参

```
/**
 * @param docker : dockerode 的实例
 * @param cleanUselessImage : 是否清理镜像
 */
```

返回值无

### checkDocker

检查 Docker 环境

入参无，返回值无

### cleanUselessImagesByTag

清理无效镜像

入参

```
/**
 * @param docker : dockerode 的实例
 * @param cleanUselessImage : 是否清理镜像
 */
```

返回值无

### genContainerResourcesLimitConfig

获取容器资源限制配置

入参：

```
/**
 * @param memorySize 内存大小
 */
```

返回值：

```
{
  CpuPeriod: number;
  CpuQuota: number;
  Memory: number;
  Ulimits: [
    { Name: "nofile", Soft: 1024, Hard: 1024 },
    { Name: "nproc", Soft: 1024, Hard: 1024 },
  ];
}
```

### isDockerToolBox

是不是虚拟机的 docker 环境

入参无

返回值 `boolean`

### checkLanguage

checkLanguage 检查环境是否安装 python，java，nodejs 等语言环境

入参

```
/**
 * @param runtime
 */
```

返回值

```
[result: boolean, details: string]
```

### setBuildState

设置 build 的状态

入参

```
/**
 * @param serviceName
 * @param functionName
 * @param sYaml s.yaml 配置的地址，默认是 process.cwd()
 * @param { status: 'available' | 'unavailable' }
 */
```

返回值 无

### getBuildState

获取 build 的状态

入参

```
/**
 * @param serviceName
 * @param functionName
 * @param sYaml s.yaml 配置的地址，默认是 process.cwd()
 */
```

返回值

```
{
  status: 'available' | 'unavailable',
  state: boolean,
  error?: CatchableError
}
```

### CatchableError 提示性错误

入参

```

tips: string;
message: string;

```

示例

```

throw new CatchableError("Please provide region in your props.");

```

### formatterOutput

输出规范

[实现](./src/utils/formatter-output.ts)

### getConfigFromFile

获取 fc-defualt 的配置，其中一些返回值会被环境变量覆盖：
`fc-endpoint`: `process.env['s-default-fc-endpoint'] || process.env.s_default_fc_endpoint || 配置文件的 fc-endpoint`

`enable-fc-endpoint`: `process.env['s-default-enable-fc-endpoint'] || process.env.s_default_enable_fc_endpoint || 配置文件的['enable-fc-endpoint']`

入参无

返回值

```
{
  [key: string]: string
}
```

### getEndpointFromFcDefault

获取 fc 的自定义 endpoint，获取规则 [getConfigFromFile](#getConfigFromFile)方法返回值中存在 `fc-endpoint`，并且 `enable-fc-endpoint` 等于 'true'

返回值 `string` | `null`

### makeFcClient

获取 fc 客户端，自定义 endpoint 获取调用的[getEndpointFromFcDefault](#getEndpointFromFcDefault)的方法

入参：

```
/**
 @param props {
  access: string;
  region: string;
  timeout?: number;
  credentials?: {
    AccountID?: string;
    AccessKeyID?: string;
    AccessKeySecret?: string;
    SecurityToken?: string;
    endpoint?: string;
  };
}
 */
```

返回 `fc 客户端`

### isCustomContainerRuntime

判断是否是自定义镜像运行时

入参

```
/**
 * @param runtime string
 */
```

返回值 `boolean`

### isCustomRuntime

判断是否是自定义运行时

入参

```
/**
 * @param runtime string
 */
```

返回值 `boolean`

### isAuto

判断配置是否是 auto

入参

```
/**
 * @param runtime string
 */
```

返回值 `boolean`

### genDomainName

domain auto 生成域名的规则

入参

```
/**
 * @param uid 用户主账号 id
 * @param region
 * @param serviceName
 * @param functionName
 */
```

返回值 `string`

### buildLink

buildLink build 之后热更的能力

入参

```
/**
* @param props : {
  configDirPath: yaml 路径
  codeUri: 代码路径
  runtime: 运行时
  serviceName: 服务名称
  functionName: 函数名称
  excludeFiles: 忽略的路径
}
* @param checkBuildState 默认是 true
*/
```

返回无

### genBuildLinkFilesListJSONPath

获取热更的能力的缓存文件地址

入参

```
/**
* @param baseDir s.yaml 的路径
* @param serviceName 服务名称
* @param functionName 函数名称
*/
```

返回 `string`

### getBuildArtifactPath

获取 build 的 use-docker 产物文件夹路径

入参

```
/**
* @param baseDir s.yaml 的路径
* @param serviceName 服务名称
* @param functionName 函数名称
*/
```

返回 `string`

### DeployCache

deploy 缓存相关

#### 获取缓存数据

示例

```
async function test() {
  const sYaml = '/Users/main/fc-custom-typescript-event/s.yaml';
  const region = 'cn-chengdu';
  const accountID = '143********149';

  const serviceName = 'test-custom-config';
  const functionName = 'tsEventFunc';
  const triggerNames = ['httpTrigger'];
  const customDomains = ['auto'];

  const g = new DeployCache(accountID, region, sYaml);
  const res = await g.getYamlState({
    serviceName,
    functionName,
    triggerNames,
    customDomains,
  });
  console.log(JSON.stringify(res, null, 2));
}

test()
```

#### 获取缓存 Id

```
DeployCache.genServiceStateID
参数：(accountID: string, region: string, serviceName: string)

DeployCache.genFunctionStateID
参数：(accountID: string, region: string, serviceName: string, functionName: string)

DeployCache.genTriggerStateID
参数：(accountID: string, region: string, serviceName: string, functionName: string, triggerName: string)

DeployCache.genDomainStateID
(domainName: string, genDomainProps?: { accountID: string; region: string; serviceName: string; functionName: string; })
```
