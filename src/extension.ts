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

import { lintDocument } from "./linter";



export function activate(context: vscode.ExtensionContext) {
	const collection = vscode.languages.createDiagnosticCollection("yamllint-js");

	const updateDiagnostics = async (e?: vscode.TextEditor | vscode.TextDocumentChangeEvent) => {
		const document = e?.document;
		if (document?.languageId === "yaml") {
			const diagnostics = await lintDocument(document);
			collection.set(document.uri, diagnostics);
		} else if (document) {
			deleteDiagnostics(document);
		}
	};

	const deleteDiagnostics = (e: vscode.TextDocument) => {
		collection.delete(e.uri);
	};

	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor);
	}

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(updateDiagnostics),
		vscode.workspace.onDidChangeTextDocument(updateDiagnostics),
		vscode.workspace.onDidCloseTextDocument(deleteDiagnostics),
	);

	context.subscriptions.push(collection);
}



export function deactivate() {
}
