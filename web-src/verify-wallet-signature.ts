import { verifyPersonalMessageSignature } from '@mysten/sui/verify';

type VerificationInput = {
	walletAddress?: string;
	message?: string;
	signature?: string;
};

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	return Buffer.concat(chunks).toString('utf8').trim();
}

async function main() {
	const raw = await readStdin();
	if (!raw) {
		throw new Error('empty verification payload');
	}
	const payload = JSON.parse(raw) as VerificationInput;
	const walletAddress = String(payload.walletAddress || '').trim();
	const message = String(payload.message || '');
	const signature = String(payload.signature || '').trim();
	if (!walletAddress || !message || !signature) {
		throw new Error('walletAddress, message, and signature are required');
	}
	await verifyPersonalMessageSignature(new TextEncoder().encode(message), signature, {
		address: walletAddress,
	});
	process.stdout.write(JSON.stringify({ ok: true, walletAddress }));
}

main().catch((error) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});
