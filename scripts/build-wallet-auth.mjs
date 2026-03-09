import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

await Promise.all([
	esbuild.build({
		entryPoints: [path.join(projectRoot, 'web-src', 'wallet-auth.ts')],
		outfile: path.join(projectRoot, 'internal', 'console', 'static', 'wallet-auth.js'),
		bundle: true,
		format: 'iife',
		globalName: 'ProductWalletAuth',
		platform: 'browser',
		target: ['es2020'],
		minify: false,
		sourcemap: false,
		logLevel: 'info',
	}),
	esbuild.build({
		entryPoints: [path.join(projectRoot, 'web-src', 'verify-wallet-signature.ts')],
		outfile: path.join(projectRoot, 'internal', 'api', 'auth', 'scripts', 'verify-wallet-signature.mjs'),
		bundle: true,
		format: 'esm',
		platform: 'node',
		target: ['node20'],
		minify: false,
		sourcemap: false,
		logLevel: 'info',
		banner: { js: '#!/usr/bin/env node' },
	}),
]);
