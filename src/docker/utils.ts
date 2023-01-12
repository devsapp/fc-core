import _ from "lodash";
import { execSync } from "child_process";

/**
 * 获取 docker 的信息
 * @returns
 */
export function getDockerInfo(): any {
  const execRes = execSync('docker info --format "{{json .}}"');
  const dockerInfo = JSON.parse(execRes.toString());
  return dockerInfo;
}

export function bytesToSize(bytes: number): String {
  let size = "";
  if (bytes < 0.1 * 1024) {
    // 小于0.1KB，则转化成B
    size = `${bytes.toFixed(2)}B`;
  } else if (bytes < 0.1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    size = `${(bytes / 1024).toFixed(2)}KB`;
  } else if (bytes < 0.1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    size = `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  } else {
    // 其他转化成GB
    size = `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }

  const sizeStr = `${size}`; // 转成字符串
  const index = sizeStr.indexOf("."); // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2); // 获取小数点后两位的值
  if (dou == "00") {
    // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
}

/**
 * 当前镜像版本
 */
export const IMAGE_VERSION: string = process.env.FC_DOCKER_VERSION || "1.10.3";

/**
 * docker的默认registry
 */
export const DEFAULT_REGISTRY: string = "registry.hub.docker.com";
export const ALIYUN_REGISTRY: string = "registry.cn-beijing.aliyuncs.com";
export const DEFAULT_REPO_NAME: string = "aliyunfc";
