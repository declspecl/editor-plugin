import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

export class EmojiWidget extends WidgetType
{
	text: string;

	constructor(text: string)
	{
		super();

		this.text = text;
	}

	toDOM(view: EditorView): HTMLElement
	{
		const span = document.createElement("span");
		span.addClass("test_class");
		span.innerHTML = this.text;
	
		return span;
	}
}

export default class MyPlugin extends Plugin
{
	settings: MyPluginSettings;

	async onload()
	{
		await this.loadSettings();

		const pluginSpec: PluginSpec<EmojiListPlugin> = { decorations: (value: EmojiListPlugin) => value.decorations };

		const emojiListPlugin = ViewPlugin.fromClass(EmojiListPlugin, pluginSpec);

		this.registerEditorExtension(emojiListPlugin);
	}

	onunload()
	{

	}

	async loadSettings()
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings()
	{
		await this.saveData(this.settings);
	}
}

class EmojiListPlugin implements PluginValue
{
	decorations: DecorationSet;

	constructor(view: EditorView)
	{
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate)
	{
		if (update.docChanged || update.viewportChanged)
		{
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet
	{
		const builder = new RangeSetBuilder<Decoration>();

		console.log(view.visibleRanges);

		for (let { from, to } of view.visibleRanges)
		{
			const view_string: string = view.state.sliceDoc(from, to);
			console.log("string:", view_string);

			const matchRegex = /236P/g; // regular expression to match all occurrences of "236P"

			let match;
			while ((match = matchRegex.exec(view_string)))
			{
				console.log("match", match);

				const matchStart = from + view_string.indexOf("236P");
				const matchEnd = matchStart + 4

				builder.add(
					from + matchStart,
					from + matchEnd,
					Decoration.replace(
					{
						widget: new EmojiWidget("replaced"),
					})
				);
			}

			// syntaxTree(view.state).iterate(
			// {
			// 	from,
			// 	to,
			// 	enter(node)
			// 	{
			// 		console.log("to", to, "from", from, "node", node.type, "line", line);
			// 		console.log(view.state.doc.line(line + 1));
			// 	},
			// });
		}

		return builder.finish();
	}
}

interface MyPluginSettings
{
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings =
{
	mySetting: 'default'
}

// export const stateField = StateField.define<DecorationSet>(
// {
// 	create(state): DecorationSet
// 	{
// 		return Decoration.none;
// 	},

// 	update(oldState, transaction): DecorationSet
// 	{
// 		const build = new RangeSetBuilder<Decoration>();
		
// 		return build.finish();	
// 	},

// 	provide(field: StateField<DecorationSet>): Extension
// 	{
// 		return EditorView.decorations.from(field);
// 	}
// })

// export class FGCWidget extends WidgetType
// {
// 	toDOM(view: EditorView): HTMLElement
// 	{
// 		const div = document.createElement("span");
	
// 		div.innerText = "👉";
	
// 		return div;
// 	}
// }