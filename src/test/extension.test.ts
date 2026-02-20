import { suite, test } from "mocha";
import * as assert from "assert/strict";
import * as path from "node:path";
import * as vscode from "vscode";

import { filesDir, lintingOnNewWindow } from "./common";



suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	test("should have no errors for good.yaml", async () => {
		const uri = vscode.Uri.file(path.join(filesDir, "good.yaml"));

		const diagnostics = await lintingOnNewWindow(uri);
		assert.equal(diagnostics.length, 0, "Should have no diagnostics for valid YAML");
	});

	test("should have errors for bad.yaml", async () => {
		const uri = vscode.Uri.file(path.join(filesDir, "bad.yaml"));

		const diagnostics = await lintingOnNewWindow(uri);
		assert.notEqual(diagnostics.length, 0, "Should have diagnostics for invalid YAML");

		const errorDiagnostic = diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Error);
		assert.ok(errorDiagnostic, "Should have at least one error diagnostic");
		assert.notEqual(errorDiagnostic.message.length, 0, "Diagnostic message should not be empty");
	});
});
