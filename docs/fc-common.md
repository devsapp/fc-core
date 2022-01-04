## makeFcClient

获取 fc client

### makeFcClient(inputs: InputProps)

#### 参数：

```typescript
{
  credentials?: {
    AccountID: string;
    AccessKeyID: string;
    AccessKeySecret: string;
    SecurityToken?: string;
  },
  project?: {
    access?: string
  },
  props: {
    region: string;
    timeout?: number;
	},
}
```

#### 返回：

- 获取endpoint失败时：无返回 ｜ 返回undefined

- 成功返回FC


#### 示例：

```bash
# bash with s.yaml
$ s test makeFcClient
[2021-09-10T10:07:17.497] [INFO ] [S-CLI] - Start ...
test:
  accountid: '1921******57'
  accessKeyID: LT*****0eMkg
  accessKeySecret: 5rt**********UkJV
  endpoint: http://1921*******57.cn-shenzhen.fc.aliyuncs.com
  host: 1921******57.cn-shenzhen.fc.aliyuncs.com
  version: '2016-08-15'
  timeout: 600000
  headers: {}
```

## getCredentials

获取 credentials 值

### getCredentials(inputs: InputProps)

#### 参数：

```typescript
{
  credentials?: {
    AccountID: string;
    AccessKeyID: string;
    AccessKeySecret: string;
    SecurityToken?: string;
  },
  project?: {
    access?: string
  }
}
```

#### 返回：

```tsx
{
  access: string;
  credentials: {
    AccountID: string;
    AccessKeyID: string;
    AccessKeySecret: string;
    SecurityToken?: string;
  }
}
```

#### 示例：

```bash
# bash with s.yaml
$ s test getCredentials
[2021-09-10T10:10:26.805] [INFO ] [S-CLI] - Start ...
test:
  access: default
  credentials:
    Alias: default
    AccountID: '1921******57'
    AccessKeyID: LTA********kg
    AccessKeySecret: 5rt***********kJV
```



## genContainerResourcesLimitConfig

根据内存大小生成容器资源限制配置

### genContainerResourcesLimitConfig(memorySize: number)

#### 参数：

- memorySize: number，MB，128-3072时需为64的整数，大于3072时只能为4096 | 8192 | 16384 | 32768

#### 返回：

- memorySize不合法时：无返回 ｜ 返回undefined

- 成功返回HostConfig：

  ```tsx
  {
    CpuPeriod: number;
    CpuQuota: number;
    Memory: number;
    Ulimits: any,
  }
  ```

#### 示例：

```bash
# bash with s.yaml
$ s test genContainerResourcesLimitConfig
[2021-09-06T08:06:15.837] [INFO ] [S-CLI] - Start ...
test:
  CpuPeriod: 6400
  CpuQuota: 6400
  Memory: 134217728
  Ulimits:
    - Name: nofile
      Soft: 1024
      Hard: 1024
    - Name: nproc
      Soft: 1024
      Hard: 1024
```



## checkLanguage

根据runtime检测本地环境是否符合运行要求

### checkLuanguage(runtime: string)

#### 参数：

- turntime: string, [ python | java | node ] only.

#### 返回：

```tsx
[
  result: boolean,
  details: string
]
```

#### 示例：

```bash
# bash with s.yaml
$ s test checkLanguage
[2021-09-18T16:22:27.842] [INFO ] [S-CLI] - Start ...
test:
  - true
  - >-
    - pip 21.2.4 from
    /Users/linjiaxiang/opt/anaconda3/lib/python3.9/site-packages/pip (python
    3.9)

    - python 3.9.4
```



## checkDocker

检测本地docker是否正常运行

### checkDocker()

#### 参数：空

#### 返回：

```tsx
[
  result: boolean,
  details: string
]
```

#### 示例：

```bash
# bash with s.yaml
$ s test checkDocker  
[2021-09-18T16:24:58.908] [INFO ] [S-CLI] - Start ...
test:
  - true
  - |
    Docker installed.
```

