import fs from 'fs';
import path from 'path';
import { AxiosError } from 'axios';
import { apiConfig } from '../config/api';
import { compressFilesToTar } from '../utils/compress-files';
import createProjectAction from '../create-project/action';
import type { CLIContext, ProjectInfos } from '../types';
import { getTmpStoragePath } from '../config/local';
import { cloudApiFactory, tokenServiceFactory, local } from '../services';
import { notificationServiceFactory } from '../utils/notification-service';
import { loadPkg } from '../utils/pkg';

const FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

type PackageJson = {
  strapi?: {
    uuid: string;
  };
};

async function upload(ctx: CLIContext, project: ProjectInfos, token: string) {
  const cloudApi = cloudApiFactory(token);
  // * Upload project
  try {
    const storagePath = getTmpStoragePath();
    const projectFolder = path.resolve(process.cwd());
    const packageJson = (await loadPkg(ctx)) as PackageJson;

    if (!packageJson) {
      ctx.logger.error(
        'Unable to deploy the project. Please make sure the package.json file is correctly formatted.'
      );
      return;
    }
    if (!packageJson.strapi || !packageJson.strapi.uuid) {
      ctx.logger.error(
        'The project is not a Strapi project. Please make sure the package.json file is correctly formatted. It should contain a `strapi` object with a `uuid` property.'
      );
      return;
    }

    ctx.logger.log('📦 Compressing project...');
    const compressedFilename = `${packageJson.strapi.uuid}.tar.gz`;
    try {
      ctx.logger.debug(
        'Compression parameters\n',
        `Storage path: ${storagePath}\n`,
        `Project folder: ${projectFolder}\n`,
        `Compressed filename: ${compressedFilename}`
      );
      await compressFilesToTar(storagePath, projectFolder, compressedFilename);
      ctx.logger.log('📦 Project compressed successfully!');
    } catch (error: unknown) {
      ctx.logger.error(
        '⚠️ Project compression failed. Try again later or check for large/incompatible files.'
      );
      ctx.logger.debug(error);
      process.exit(1);
    }

    const tarFilePath = path.resolve(storagePath, compressedFilename);
    const fileStats = fs.statSync(tarFilePath);

    if (fileStats.size > FILE_SIZE_LIMIT) {
      return ctx.logger.log(
        'Unable to proceed: Your project is too big to be transferred, please use a git repo instead.'
      );
    }

    ctx.logger.info('🚀 Uploading project...');
    const progressBar = ctx.logger.progressBar(100, 'Upload Progress');

    try {
      await cloudApi.deploy(
        { filePath: tarFilePath, project },
        {
          onUploadProgress(progressEvent) {
            const total = progressEvent.total || fileStats.size;
            const percentage = Math.round((progressEvent.loaded * 100) / total);
            progressBar.update(percentage);
          },
        }
      );
      progressBar.update(100);
      progressBar.stop();
      ctx.logger.success('✨ Upload finished!');
    } catch (error: any) {
      progressBar.stop();
      if (error instanceof AxiosError && error.response?.data) {
        if (error.response.status === 404) {
          ctx.logger.error(
            `The project does not exist. Remove the ${local.LOCAL_SAVE_FILENAME} file and try again.`
          );
        } else {
          ctx.logger.error(error.response.data);
        }
      } else {
        ctx.logger.error('An error occurred while deploying the project. Please try again later.');
      }

      ctx.logger.debug(JSON.stringify(error));
    }
    process.exit(0);
  } catch (e: any) {
    ctx.logger.error('An error occurred while deploying the project. Please try again later.');
    ctx.logger.debug(JSON.stringify(e));
    process.exit(1);
  }
}

async function getProject(ctx: CLIContext) {
  const { project } = local.retrieve();
  if (!project) {
    try {
      return await createProjectAction(ctx)();
    } catch (error: any) {
      ctx.logger.error('An error occurred while deploying the project. Please try again later.');
      ctx.logger.debug(JSON.stringify(error));
      process.exit(1);
    }
  }
  return project;
}

export default async (ctx: CLIContext) => {
  const { getValidToken } = tokenServiceFactory(ctx);
  const token = await getValidToken();

  if (!token) {
    return;
  }

  const project = await getProject(ctx);

  if (!project) {
    return;
  }

  const notificationService = notificationServiceFactory(ctx);
  notificationService(`${apiConfig.apiBaseUrl}/v1/notifications`, token);
  return upload(ctx, project, token);
};
