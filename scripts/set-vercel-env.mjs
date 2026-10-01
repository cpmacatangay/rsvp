// deterministic re-set of the four production env vars (pwsh stdin pipes
// truncated long values; spawnSync feeds exact UTF-8 bytes). Requires an
// authenticated vercel CLI + a linked project.
import { spawnSync } from 'node:child_process';
import { readFileSync, unlinkSync, existsSync } from 'node:fs';

const entries = readFileSync('.env', 'utf8')
  .split(/\r?\n/)
  .filter((line) => /^[A-Z_]+=.+$/.test(line))
  .map((line) => {
    const eq = line.indexOf('=');
    return [line.slice(0, eq), line.slice(eq + 1)];
  });

for (const [key, value] of entries) {
  // remove any previous (possibly truncated) value, then add fresh
  spawnSync('npx.cmd', ['--yes', 'vercel@latest', 'env', 'rm', key, 'production', '--yes'], {
    stdio: 'inherit',
  });
  const add = spawnSync(
    'npx.cmd',
    ['--yes', 'vercel@latest', 'env', 'add', key, 'production', '--sensitive=true'],
    { input: `${value}\n`, encoding: 'utf8' },
  );
  const out = `${add.stdout ?? ''}${add.stderr ?? ''}`;
  const ok = out.includes('added') || out.includes('Updated') || out.includes('Created');
  console.log(
    `${key}: ${ok ? 'SET' : 'CHECK'} (len ${key.length + 1 + value.length}) :: ${out.split('\n')
      .slice(-3)
      .join(' | ')
      .trim()}`,
  );
}

for (const f of ['.vercel-prod-check.env']) {
  if (existsSync(f)) unlinkSync(f); // contains secrets
}
