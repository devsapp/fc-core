import _ from "lodash";
import * as core from "@serverless-devs/core";
import DraftLog from "draftlog";
import { getDockerInfo, IMAGE_VERSION } from "./utils";
import { commandExists, CatchableError } from "../utils";
import logger from "../utils/logger";

DraftLog.into(console);

/**
 * 清理无效镜像
 * @param docker: Docker 实例
 * @param cleanUselessImage: 直接清理掉无效的镜像
 */
export const cleanUselessImagesByTag = async (docker, cleanUselessImage) => {
  // TODO: loading 效果
  const listImages: Array<any> = await docker.listImages();
  logger.debug(`listImages:: ${JSON.stringify(listImages)}\nlength:: ${listImages.length}`);

  const images = _.map(
    _.filter(listImages, (imageItem) => {
      const { MAINTAINER, maintainer } = imageItem.Labels || {};
      if (!(MAINTAINER === 'alibaba-serverless-fc' || maintainer === 'alibaba-serverless-fc')) {
        logger.debug(`return: imageItem.RepoTags is: ${imageItem.RepoTags} ${imageItem.Labels}`);
        return false;
      }
      try {
        const tagVersion = _.last(_.split(_.first(imageItem.RepoTags), ":"));
        const version = _.last(_.split(tagVersion, "-"));
        const versionLtFlag = core.semver.lt(version, IMAGE_VERSION);
        logger.debug(`imageItem.RepoTags is: ${imageItem.RepoTags}, versionLtFlag: ${versionLtFlag}`);

        return versionLtFlag;
      } catch (_e) {
        logger.debug(`error: imageItem.RepoTags is: ${imageItem.RepoTags}`);
        return false;
      }
    }),
    (image) => {
      return docker.getImage(image.Id);
    }
  );
  logger.debug(`images:: ${JSON.stringify(images)}\nlength:: ${images.length}`);

  if (cleanUselessImage) {
    _.each(images, (item) => item.remove({ force: true }));
  } else if (!_.isEmpty(images)) {
    logger.warn('A lower version of the docker image is detected, you can specify --clean-useless-image to clean');
  }
};

/**
 * 执行之前检查Docker环境
 */
export async function checkDocker() {
  if (!(await commandExists("docker"))) {
    throw new CatchableError(
      "Failed to start docker, Please ensure that docker is installed on your computer."
    );
  } else {
    const dockerInfo = getDockerInfo();
    if (!_.isEmpty(_.get(dockerInfo, "ServerErrors"))) {
      throw new CatchableError(
        "Failed to start docker, Please ensure that docker is started on your computer."
      );
    }
  }
}

/**
 * 使用 docker 前置操作
 * @param docker: Docker 实例
 * @param cleanUselessImage: 直接清理掉无效的镜像
 */
export const preExecute = async (docker, cleanUselessImage) => {
  await checkDocker();
  // 参数不确定，先跳过这个功能
  logger.debug(`docker: ${docker} cleanUselessImage: ${cleanUselessImage}`);
  // await cleanUselessImagesByTag(docker, cleanUselessImage);
};
