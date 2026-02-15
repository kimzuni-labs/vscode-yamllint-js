import * as assert from "assert/strict";
import * as vscode from "vscode";
import * as path from "path";



function waitForDiagnostics(uri: vscode.Uri, timeout = 5000): Promise<vscode.Diagnostic[]> {
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



suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	const filesDir = path.resolve("src", "test", "files");

	test("should have no errors for good.yaml", async () => {
		const uri = vscode.Uri.file(path.join(filesDir, "good.yaml"));

		// Start waiting before opening to catch fast updates
		const diagnosticPromise = waitForDiagnostics(uri);

		const document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);

		await diagnosticPromise;

		const diagnostics = vscode.languages.getDiagnostics(uri);
		assert.equal(diagnostics.length, 0, "Should have no diagnostics for valid YAML");
	});

	test("should have errors for bad.yaml", async () => {
		const uri = vscode.Uri.file(path.join(filesDir, "bad.yaml"));

		// Start waiting before opening to catch fast updates
		const diagnosticPromise = waitForDiagnostics(uri);

		const document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);

		await diagnosticPromise;

		const diagnostics = vscode.languages.getDiagnostics(uri);
		assert.notEqual(diagnostics.length, 0, "Should have diagnostics for invalid YAML");

		const errorDiagnostic = diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Error);
		assert.ok(errorDiagnostic, "Should have at least one error diagnostic");
		assert.notEqual(errorDiagnostic.message.length, 0, "Diagnostic message should not be empty");
	});
});
