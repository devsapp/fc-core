import _ from "lodash";
import { isChinaTimeZone } from "../utils";
// import * as httpx from "httpx";
import { CatchableError } from "../utils/errors";
import logger from "../utils/logger";
import { IMAGE_VERSION, DEFAULT_REGISTRY, DEFAULT_REPO_NAME, ALIYUN_REGISTRY } from "./utils";

async function pullImage(docker, imageName: string): Promise<string> {
  const stream = await docker.pull(imageName);

  return await new Promise((resolve, reject) => {
    logger.debug(`Begin pulling image ${imageName}, you can also use docker pull ${imageName} to pull image by yourself.`);

    const onFinished = async (err) => {
      if (err) {
        return reject(err);
      }
      resolve(DEFAULT_REGISTRY);
    };

    const barLines: any = {};

    const onProgress: Function = (event) => {
      let status: any = event.status;

      if (event.progress) {
        status = `${event.status} ${event.progress}`;
      }

      if (event.id) {
        const id: number = event.id;
        if (!barLines[id]) {
          // @ts-ignore
          barLines[id] = console.draft();
        }
        barLines[id](id + ": " + status);
      } else {
        if (_.has(event, "aux.ID")) {
          event.stream = event.aux.ID + "\n";
        }
        const out: any = event.status ? event.status + "\n" : event.stream;
        process.stdout.write(out);
      }
    };

    docker.modem.followProgress(stream, onFinished, onProgress);
  });
}

/**
 * 是否需要拉取镜像
 * @param docker 
 * @param imageName 
 */
export async function pullImageIfNeed(
  docker,
  imageName: string
): Promise<void> {
  const images: Array<any> = await docker.listImages({
    filters: {
      reference: [imageName],
    },
  });
  if (_.size(images) === 0) {
    await pullImage(docker, imageName);
  } else {
    logger.info(`Skip pulling image ${imageName}...`);
  }
}

const runtimeImageMap: { [key: string]: string } = {
  nodejs6: "nodejs6",
  nodejs8: "nodejs8",
  nodejs10: "nodejs10",
  nodejs12: "nodejs12",
  nodejs14: "nodejs14",
  "python2.7": "python2.7",
  python3: "python3.6",
  'python3.9': "python3.9",
  java8: "java8",
  java11: "java11",
  "php7.2": "php7.2",
  "dotnetcore2.1": "dotnetcore2.1",
  custom: "custom",
  go1: "go1",
};

/**
 * docker image 的地址
 * @param runtime 
 * @param isBuild 
 * @returns 
 */
export async function resolveRuntimeToDockerImage(
  runtime: string,
  isBuild?: boolean
): Promise<string> {
  if (runtimeImageMap[runtime]) {
    if (runtime === 'go1' && isBuild) {
      throw new CatchableError(`invalid runtime name ${runtime}`);
    }

    const name = runtimeImageMap[runtime];
    let imageName;
    if (isBuild) {
      imageName = `${DEFAULT_REPO_NAME}/runtime-${name}:build-${IMAGE_VERSION}`;
    } else {
      imageName = `${DEFAULT_REPO_NAME}/runtime-${name}:${IMAGE_VERSION}`;
    }

    const resolveRegistryImage = await resolveDockerRegistry(imageName);
    logger.debug("need use image: " + resolveRegistryImage);
    return resolveRegistryImage;
  }
  throw new CatchableError(`invalid runtime name ${runtime}`);
}

async function resolveDockerRegistry(imageName: string): Promise<any> {
  if (process.env.FC_DOCKER_REGISTRY) {
    return `${process.env.FC_DOCKER_REGISTRY}/${imageName}`;
  }
  if (isChinaTimeZone()) {
    return `${ALIYUN_REGISTRY}/${imageName}`;
  }
  return `${DEFAULT_REGISTRY}/${imageName}`;
}
