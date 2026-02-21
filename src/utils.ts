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

// @ts-expect-error: ts(1541)
import type * as yamllintJs from "yamllint-js/internal";



export function getWorkspaceUri(uri: vscode.Uri) {
	return vscode.workspace.getWorkspaceFolder(uri)?.uri ?? vscode.Uri.joinPath(uri, "..");
}

export const importYamllintJs = (() => {
	const map: Partial<typeof yamllintJs> = {};
	return async function importYamllintJs<K extends keyof typeof yamllintJs>(key: K) {
		map[key] ??= await import("yamllint-js/internal").then(x => x[key]);
		return map[key]!;
	};
})();
