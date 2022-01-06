import _ from "lodash";
import commandExists from "command-exists";
import * as core from "@serverless-devs/core";
import DraftLog from "draftlog";
import { CatchableError } from "../utils/errors";
import { getDockerInfo, IMAGE_VERSION } from "./utils";

DraftLog.into(console);

/**
 * 清理无效镜像
 * @param docker: Docker 实例
 * @param tag
 */
export const cleanUselessImagesByTag = async (docker) => {
  // TODO: loading 效果
  const listImages: Array<any> = await docker.listImages({
    filters: '{"label": ["maintainer=alibaba-serverless-fc"]}',
  });
  const images = _.map(
    _.filter(listImages, (item) => {
      try {
        // RepoTags: aliyunfc/runtime-python3.6:1.9.21
        const version = _.last(_.split(_.first(item.RepoTags), ":"));
        return core.semver.lte(_.last(_.split(version, "-")), IMAGE_VERSION);
      } catch (error) {
        return false;
      }
    }),
    (image) => {
      return docker.getImage(image.Id);
    }
  );
  _.each(images, (item) => item.remove({ force: true }));
};

/**
 * 执行之前检查Docker环境
 */
export function checkDocker() {
  if (!commandExists("docker")) {
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

export const preExecute = async (docker) => {
  checkDocker();
  await cleanUselessImagesByTag(docker);
};
