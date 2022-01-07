## FC-Core

### makeFcClient 获取 fc 客户端

入参：
````
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
````
返回 `fc 客户端`

### IMAGE_VERSION 镜像的版本

### resolveRuntimeToDockerImage 获取docker 镜像的地址

入参：
````
/**
 * @param runtime 函数计算运行时
 * @param isBuild? 是否是执行 build
 */
````

### pullImageIfNeed 是否需要拉取镜像

入参：
````
/**
 * @param docker : dockerode 的实例
 * @param imageName : docker 镜像的地址
 */
````
返回值 `undefined`

### preExecute 检查Docker环境并清理无效镜像
 
入参无，返回值无

### checkDocker 检查Docker环境
 
入参无，返回值无

### cleanUselessImagesByTag 清理无效镜像
 
入参无，返回值无


### genContainerResourcesLimitConfig 生成容器资源限制配置

入参：
````
/**
 * @param memorySize 内存大小
 */
````
返回值：
````
{
  CpuPeriod: number;
  CpuQuota: number;
  Memory: number;
  Ulimits: [
    { Name: "nofile", Soft: 1024, Hard: 1024 },
    { Name: "nproc", Soft: 1024, Hard: 1024 },
  ];
}
````

### isDockerToolBox 是不是虚拟机的 docker 环境

入参无

返回值 `boolean`

### checkLanguage 检查环境是否安装python，java，nodejs等语言环境

入参
````
/**
 * @param runtime
 */
````

返回值
````
[result: boolean, details: string]
````

### CatchableError 提示性错误

入参
````
tips: string;
message: string;
````

示例
````
throw new CatchableError("Please provide region in your props.");
````

### formatterOutput 输出规范

[实现](./src/utils/formatter-output.ts)


### getConfigFromFile 获取 fc-defualt 的配置

入参无

返回值
````
{
  [key: string]: string
}
````

### isCustomContainerRuntime 判断是否是镜像运行时

入参
````
/**
 * @param runtime string
 */
````

返回值 `boolean`


### isCustomRuntime 判断是否是镜像运行时

入参
````
/**
 * @param runtime string
 */
````

返回值 `boolean`

### isAuto 判断是否是镜像运行时

入参
````
/**
 * @param runtime string
 */
````

返回值 `boolean`


### genDomainName domain auto 生成域名的规则

入参
````
/**
 * @param uid 用户主账号 id
 * @param region
 * @param serviceName 
 * @param functionName 
 */
````

返回值 `string`

### buildLink build之后热更的能力

入参
````
/**
* @param props : {
  configDirPath: yaml 路径
  codeUri: 代码路径
  serviceName: 服务名称
  functionName: 函数名称
  excludeFiles: 忽略的路径
} */
````

返回无


### genBuildLinkFilesListJSONPath 热更的能力的缓存文件

入参
````
/**
* @param baseDir s.yaml 的路径
* @param serviceName 服务名称
* @param functionName 函数名称
*/
````

返回 `string`

### getBuildArtifactPath build产物的文件夹路径

入参
````
/**
* @param baseDir s.yaml 的路径
* @param serviceName 服务名称
* @param functionName 函数名称
*/
````

返回 `string`
