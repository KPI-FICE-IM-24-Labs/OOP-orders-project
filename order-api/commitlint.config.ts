import { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (commit) => commit.startsWith('Merge'),
    (commit) => commit.startsWith('Revert'),
    (commit) => commit.startsWith('Initial'),
  ],
};
export default Configuration;
