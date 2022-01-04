import _ from "lodash";
import * as httpx from "httpx";
import { CatchableError } from "../utils/errors";
import logger from "../utils/logger";
import { IMAGE_VERSION, DEFAULT_REGISTRY, DOCKER_REGISTRIES } from "./utils";

let DOCKER_REGISTRY_CACHE = null;

async function resolveDockerRegistry(imageName: string): Promise<any> {
  if (DOCKER_REGISTRY_CACHE) {
    return DOCKER_REGISTRY_CACHE;
  }
  const promises = DOCKER_REGISTRIES.map((r) =>
    httpx
      .request(`https://${r}/v2/aliyunfc/runtime-nodejs8/tags/list`, {
        timeout: 2500,
      })
      .then(() => r)
  );
  try {
    DOCKER_REGISTRY_CACHE = await Promise.race(promises);
  } catch (error) {
    DOCKER_REGISTRY_CACHE = DEFAULT_REGISTRY;
  }
  if (DOCKER_REGISTRY_CACHE) {
    return imageName;
  }
}

async function pullImage(docker, imageName: string): Promise<string> {
  const resolveImageName: string = await resolveDockerRegistry(imageName);

  const stream = await docker.pull(resolveImageName);

  return await new Promise((resolve, reject) => {
    logger.info(`Begin pulling image ${imageName}, you can also use docker pull ${imageName} to pull image by yourself.`);

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

// pullImageIfNeed(docker, 'aliyunfc/runtime-python3.6:build-1.10.0');
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
  "python2.7": "python2.7",
  python3: "python3.6",
  java8: "java8",
  java11: "java11",
  "php7.2": "php7.2",
  "dotnetcore2.1": "dotnetcore2.1",
  custom: "custom",
};

export async function resolveRuntimeToDockerImage(
  runtime: string,
  isBuild?: boolean
): Promise<string> {
  if (runtimeImageMap[runtime]) {
    const name = runtimeImageMap[runtime];
    var imageName;
    if (isBuild) {
      imageName = `aliyunfc/runtime-${name}:build-${IMAGE_VERSION}`;
    } else {
      imageName = `aliyunfc/runtime-${name}:${IMAGE_VERSION}`;
    }

    logger.debug("imageName: " + imageName);
    return imageName;
  }
  throw new CatchableError(`invalid runtime name ${runtime}`);
}
