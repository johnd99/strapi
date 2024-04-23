import inquirer from 'inquirer';
import { AxiosError } from 'axios';
import { defaults } from 'lodash/fp';
import type { CLIContext, ProjectAnswers, ProjectInput } from '../types';
import { tokenServiceFactory, cloudApiFactory } from '../services';

function handleError(ctx: CLIContext, error: Error) {
  const tokenService = tokenServiceFactory(ctx);
  const { logger } = ctx;

  logger.debug(JSON.stringify(error));
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 401:
        logger.error('Your session has expired. Please log in again.');
        tokenService.eraseToken();
        return;
      case 403:
        logger.error(
          error.response.data ||
            'You do not have permission to create a project. Please contact support for assistance.'
        );
        return;
      case 400:
        logger.error('Invalid input. Please check your inputs and try again.');
        return;
      default:
        break;
    }
  }
  logger.error(
    'We encountered an issue while creating your project. Please try again in a moment. If the problem persists, contact support for assistance.'
  );
}

export default (ctx: CLIContext) => {
  const { getValidToken } = tokenServiceFactory(ctx);

  return async () => {
    const token = await getValidToken();
    if (!token) {
      return;
    }
    const cloudApi = cloudApiFactory(token);
    const { data: config } = await cloudApi.config();
    const { questions, defaults: defaultValues } = config.projectCreation;

    const projectAnswersDefaulted = defaults(defaultValues);
    const projectAnswers = await inquirer.prompt<ProjectAnswers>(questions);

    const projectInput: ProjectInput = projectAnswersDefaulted(projectAnswers);

    try {
      const { data } = await cloudApi.createProject(projectInput);
      return data;
    } catch (error: Error | unknown) {
      handleError(ctx, error as Error);
    }
  };
};
