import { suite, test, before, after } from "mocha";
import * as assert from "assert/strict";
import * as path from "node:path";
import * as fs from "node:fs";
import * as vscode from "vscode";

import { filesDir, lintingOnNewWindow } from "./common";



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
		const run = async (config?: string) => {
			if (config) {
				await fs.promises.writeFile(configFile, config);
				await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
			}
			const diagnostics = await lintingOnNewWindow(uri);
			return diagnostics.find(d => d.code === "document-start");
		};

		const docStartWarning = await run();
		assert.ok(docStartWarning);

		const docStartWarningGivenConfig = await run("extends: relaxed");
		assert.ok(!docStartWarningGivenConfig);
	});
});
