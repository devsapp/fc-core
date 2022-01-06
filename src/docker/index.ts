import _ from "lodash";
import { CatchableError } from "../utils/errors";
import { bytesToSize, getDockerInfo } from "./utils";
import logger from "../utils/logger";

export { pullImageIfNeed, resolveRuntimeToDockerImage } from "./pull-images";
export { preExecute } from "./pre-execute";
export { IMAGE_VERSION } from "./utils";

/**
 * 生成容器资源限制配置
 * @param memorySize 内存大小
 * @returns HostConfig define by DockerEngineAPI
 */
export async function genContainerResourcesLimitConfig(
  memorySize: number
): Promise<any> {
  // memorySize = memorySize.props.memorySize; // for test

  if (memorySize < 128) {
    throw new CatchableError(
      `ContainerMemory is too small (min: 128, actual: '${memorySize}').`
    );
    return;
  } else if (memorySize < 3072 && memorySize % 64 !== 0) {
    throw new CatchableError(
      `ContainerMemory is set to an invalid value. The value must be a multiple of 64 MB. (actual: '${memorySize}').`
    );
  } else if (
    memorySize > 3072 &&
    ![4096, 8192, 16384, 32768].includes(memorySize)
  ) {
    throw new CatchableError(
      `Memory is set to an invalid value (allowed: 4096 | 8192 | 16384 | 32768, actual: '${memorySize}').`
    );
  }

  const dockerInfo = getDockerInfo();
  const { NCPU, MemTotal } = dockerInfo;
  const isWin: boolean = process.platform === "win32";
  const memoryCoreRatio: number = memorySize > 3072 ? 1 / 2048 : 2 / 3072; // 内存核心比，弹性实例2C/3G，性能实例1C/2G

  const cpuPeriod = 6400;
  let cpuQuota: number = Math.ceil(cpuPeriod * memoryCoreRatio * memorySize);
  cpuQuota = Math.min(cpuQuota, cpuPeriod * NCPU); // 最高不超过限制
  cpuQuota = Math.max(cpuQuota, cpuPeriod); // 按照内存分配cpu配额时, 最低为100%，即1Core

  let memory = memorySize * 1024 * 1024; // bytes
  if (memory > MemTotal) {
    memory = MemTotal;
    logger.warn(`The memory config exceeds the docker limit. The memory actually allocated: ${bytesToSize(
      memory
    )}.
Now the limit of RAM resource is ${MemTotal} bytes. To improve the limit, please refer: https://docs.docker.com/desktop/${
      isWin ? "windows" : "mac"
    }/#resources.`);
  }

  const ulimits: any = [
    { Name: "nofile", Soft: 1024, Hard: 1024 },
    { Name: "nproc", Soft: 1024, Hard: 1024 },
  ];

  return {
    CpuPeriod: cpuPeriod,
    CpuQuota: cpuQuota,
    Memory: memory,
    Ulimits: ulimits,
  };
}

/**
 * 是不是虚拟机的 docker 环境
 * @returns 
 */
export async function isDockerToolBox() {
  // check version
  const dockerInfo = getDockerInfo();
  const serverVersion = dockerInfo.ServerVersion;
  const cur = serverVersion.split(".");
  // 1.13.1
  if (Number.parseInt(cur[0]) === 1 && Number.parseInt(cur[1]) <= 13) {
    const errorMessage = `We detected that your docker version is ${serverVersion}, for a better experience, please upgrade the docker version.`;
    throw new CatchableError(errorMessage);
  }
  // return isDockerToolBox
  const obj = _.map(dockerInfo.Labels || [], (e) => _.split(e, "=", 2))
    .filter((e) => e.length === 2)
    .reduce((acc, cur) => ((acc[cur[0]] = cur[1]), acc), {});
  return process.platform === "win32" && obj.provider === "virtualbox";
}
