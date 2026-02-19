import { suite, test, before, after } from "mocha";
import * as assert from "assert/strict";
import * as path from "node:path";
import * as fs from "node:fs";
import * as vscode from "vscode";

import { filesDir, waitForDiagnostics } from "./common";



suite("Config Test Suite", () => {
	const yamlFile = path.join(filesDir, "no-doc-start.yaml");
	const configFile = path.resolve(".yamllint");



	const cleanup = async () => {
		try {
			await fs.promises.unlink(configFile);
		} catch {
		}
	};

	before(cleanup);
	after(cleanup);

	test("should respect yamllint configuration", async () => {
		const uri = vscode.Uri.file(yamlFile);
		let diagnosticPromise, document, diagnostics;

		diagnosticPromise = waitForDiagnostics(uri);
		document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);
		await diagnosticPromise;

		diagnostics = vscode.languages.getDiagnostics(uri);

		const docStartWarning = diagnostics.find(d => d.code === "document-start");
		assert.ok(docStartWarning);



		const configContent = "extends: relaxed";
		await fs.promises.writeFile(configFile, configContent);
		await vscode.commands.executeCommand("workbench.action.closeActiveEditor");

		diagnosticPromise = waitForDiagnostics(uri);
		document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);
		await diagnosticPromise;

		diagnostics = vscode.languages.getDiagnostics(uri);

		const docStartWarningGivenConfig = diagnostics.find(d => d.code === "document-start");
		assert.ok(!docStartWarningGivenConfig);
	});
});
