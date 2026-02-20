import * as path from "node:path";
import * as vscode from "vscode";



export const filesDir = path.resolve("src", "test", "files");



export function waitForDiagnostics(uri: vscode.Uri, timeout = 5000): Promise<vscode.Diagnostic[]> {
	return new Promise(resolve => {
		const disposable = vscode.languages.onDidChangeDiagnostics(e => {
			if (e.uris.some(u => u.toString() === uri.toString())) {
				disposable.dispose();
				resolve(vscode.languages.getDiagnostics(uri));
			}
		});

		setTimeout(() => {
			disposable.dispose();
			resolve(vscode.languages.getDiagnostics(uri));
		}, timeout);
	});
}

export async function lintingOnNewWindow(uri: vscode.Uri) {
	// Start waiting before opening to catch fast updates
	const diagnosticPromise = waitForDiagnostics(uri);
	const document = await vscode.workspace.openTextDocument(uri);
	await vscode.window.showTextDocument(document);
	await diagnosticPromise;
	return vscode.languages.getDiagnostics(uri);
}
