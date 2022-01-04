export interface ICredentials {
  AccountID?: string;
  AccessKeyID?: string;
  AccessKeySecret?: string;
  SecurityToken?: string;
  endpoint?: string;
}

export interface InputProps {
  props: {
    region: string;
    timeout?: number;
  }; // 用户自定义输入
  credentials: ICredentials; // 用户秘钥
  project: {
    access: string; // 访问秘钥名
  };
}
export interface HttpTypeOption {
  url?: string;
  method?: string;
  path?: string;
  query?: string;
  headers?: string;
  body?: any;
  qualifier?: string;
}
export interface EventTypeOption {
  serviceName: string;
  functionName: string;
  qualifier?: string;
  payload?: any;
}

export interface PayloadOption {
  payload?: string;
  payloadFile?: string;
}
