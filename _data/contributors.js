import { execSync } from 'child_process';

export default function() {
  try {
    const result = execSync('git log --format="%aN" | sort -u', { encoding: 'utf-8' });
    const contributors = result
      .trim()
      .split('\n')
      .filter(name => name.length > 0)
      .map(name => `@${name.replace(/\s+/g, '')}`);
    return [...new Set(contributors)];
  } catch (error) {
    return ['@adamdjbrett'];
  }
}
