import type { Command } from 'commander';
import type { DistinctQuestion } from 'inquirer';
import { Logger } from './utils/logger';

export type ProjectAnswers = {
  name: string;
  nodeVersion: string;
  region: string;
  plan: string;
};

export type CloudCliConfig = {
  clientId: string;
  baseUrl: string;
  deviceCodeAuthUrl: string;
  audience: string;
  scope: string;
  tokenUrl: string;
  jwksUrl: string;
  projectCreation: {
    questions: ReadonlyArray<DistinctQuestion<ProjectAnswers>>;
    defaults: Partial<ProjectAnswers>;
  };
};

export interface CLIContext {
  cwd: string;
  logger: Logger;
}

export type StrapiCloudCommand = (params: {
  command: Command;
  argv: string[];
  ctx: CLIContext;
}) => void;

export type * from './services/cli-api';
