/*!
 * Copyright (C) 2026 kimzuni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as vscode from "vscode";

import { getWorkspaceUri, importYamllintJs } from "./utils";



export async function lintDocument(document: vscode.TextDocument) {
	const diagnostics: vscode.Diagnostic[] = [];

	try {
		const text = document.getText();
		const fileName = document.fileName;

		const loadYamlLintConfig = await importYamllintJs("loadYamlLintConfig");
		const config = await loadYamlLintConfig({
			startDir: getWorkspaceUri(document.uri).fsPath,
		});

		const linter = await importYamllintJs("linter");
		const problems = linter(text, config, fileName);

		for await (const problem of problems) {
			// vscode.Range is 0-based.
			const line = problem.line - 1;
			const column = problem.column - 1;

			// Map level to VS Code severity
			const severity = vscode.DiagnosticSeverity[problem.level === "error" ? "Error" : "Warning"];

			// Where is problem end position?
			const range = new vscode.Range(line, column, line, column + 100);

			const diagnostic = new vscode.Diagnostic(range, problem.message, severity);
			diagnostic.source = "yamllint-js";
			diagnostic.code = problem.rule;
			diagnostics.push(diagnostic);
		}
	} catch (e) {
		console.error("Error linting document:", e);
	}

	return diagnostics;
}
