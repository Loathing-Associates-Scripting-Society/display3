/**
 * @file Commits build artifacts to a release branch.
 */

import {program} from 'commander';
import {copy} from 'fs-extra';
import simpleGit, {GitError} from 'simple-git';

/**
 * Temporary directory used to store build artifacts and dependencies.
 * This must be .gitignore-ed!
 */
const DIST_DIR = 'build/dist';
/**
 * .gitignore file to filter out everything that does not belong in the release
 * branch.
 */
const RELEASE_GITIGNORE = 'release.gitignore';

program
  .option('--branch <name>', 'Name of the release branch', 'release')
  .requiredOption(
    '--use-tag-message <tag_name>',
    'Reuse the message of an annotated tag'
  )
  .action(main)
  .parse(process.argv);

interface CmdOptions {
  branch: string;
  useTagMessage: string;
}

async function main(options: CmdOptions) {
  try {
    const releaseBranch = options.branch;
    const sourceTag = options.useTagMessage;

    const git = simpleGit();

    // Retrieve the current branch, tag, or commit name
    const prevPos = (await git.raw('name-rev', '--name-only', 'HEAD')).trim();

    // Retrieve the annotation for the tag, or its associated commit message if
    // the annotation is empty
    const commitMessage = (
      await git.raw('tag', '-l', '--format=%(contents)', sourceTag)
    ).trim();
    if (!commitMessage) {
      throw new Error(
        `Cannot extract tag message. Are you sure '${sourceTag}' is a valid, annotated tag?`
      );
    }

    // Copy .gitignore to dist dir so that it can be copied back to root dir
    // before committing
    await copy(RELEASE_GITIGNORE, `${DIST_DIR}/.gitignore`);

    try {
      // Switch to release branch.
      // Since DIST_DIR is .gitignore-ed, it will be preserved after the switch.
      await git.checkout(releaseBranch);

      // Delete all previously committed files in the release branch
      try {
        await git.rm('*');
      } catch (e) {
        if (
          e instanceof GitError &&
          e.message.includes('did not match any files')
        ) {
          // Print error but continue
          console.warn(e.message);
        } else {
          throw e;
        }
      }

      // Copy contents of dist/ into project root (moveSync fails)
      await copy(DIST_DIR, '.');

      // Stage release-worthy files
      await git.add('.');

      // Create a new commit
      const commitResult = await git.commit(commitMessage);
      if (commitResult.commit) {
        console.log(
          `Created new commit ${commitResult.commit} at branch ${commitResult.branch}`
        );
      } else {
        console.log('No change detected, commit not created');
      }
    } finally {
      // Switch back to previous branch or commit
      await git.checkout(prevPos);
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}
