import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  generateProductionEnvironment,
  normalizeCommitSha,
  resolveBuildMetadata,
} from './generate-environment.mjs';

test('normalizeCommitSha truncates valid SHA to 7 lowercase chars and rejects invalid values', () => {
  assert.equal(normalizeCommitSha('ABCDEF1234567890'), 'abcdef1');
  assert.equal(normalizeCommitSha('  9f0896c  '), '9f0896c');
  assert.equal(normalizeCommitSha(''), null);
  assert.equal(normalizeCommitSha('abc'), null);
});

test('resolveBuildMetadata prioritizes AWS_COMMIT_ID over git HEAD', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tryckers-env-'));
  fs.writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({ version: '1.2.0' }),
  );

  const meta = resolveBuildMetadata({
    rootDir: tmpDir,
    env: { AWS_COMMIT_ID: '1234567890abcdef' },
    gitRunner: () => 'fffffff',
  });

  assert.deepEqual(meta, { appVersion: '1.2.0', buildCommit: '1234567' });
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('resolveBuildMetadata falls back to git HEAD and then local', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tryckers-env-'));
  fs.writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({ version: '1.2.0' }),
  );

  const fromGit = resolveBuildMetadata({
    rootDir: tmpDir,
    env: {},
    gitRunner: () => '7c35d4a\n',
  });
  assert.deepEqual(fromGit, { appVersion: '1.2.0', buildCommit: '7c35d4a' });

  const fromFallback = resolveBuildMetadata({
    rootDir: tmpDir,
    env: {},
    gitRunner: () => {
      throw new Error('git not available');
    },
  });
  assert.deepEqual(fromFallback, { appVersion: '1.2.0', buildCommit: 'local' });
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('generateProductionEnvironment writes environment.production.ts with version and buildCommit', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tryckers-env-'));
  fs.writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({ version: '1.2.0' }),
  );

  const result = generateProductionEnvironment({
    rootDir: tmpDir,
    env: {
      API_BASE_URL: 'https://api.tryckers.trycatch.tv',
      AWS_COMMIT_ID: 'a1b2c3d4e5f6',
    },
  });

  const written = fs.readFileSync(result.targetFile, 'utf-8');
  assert.match(written, /baseUrl: 'https:\/\/api\.tryckers\.trycatch\.tv\/api\/v1'/);
  assert.match(written, /appVersion: '1\.2\.0'/);
  assert.match(written, /buildCommit: 'a1b2c3d'/);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
