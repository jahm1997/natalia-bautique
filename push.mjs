
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'jahm1997';
const repo = 'natalia-bautique';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    if (file === 'node_modules' || file.startsWith('.')) continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      results.push(filePath);
    }
  }

  return results;
}

async function uploadFile(filePath) {
  const content = fs.readFileSync(filePath);
  const repoPath = filePath.startsWith('./') 
    ? filePath.slice(2) 
    : filePath;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: repoPath,
      message: 'add ' + repoPath,
      content: content.toString('base64')
    });

    console.log('✔', repoPath);
  } catch (err) {
    console.log('✖', repoPath, err.message);
  }
}

async function main() {
  const files = getFiles('./');

  for (const file of files) {
    await uploadFile(file);
  }

  console.log('🚀 listo');
}

main();
