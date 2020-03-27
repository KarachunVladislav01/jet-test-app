import {JetView} from "webix-jet";
import {activityType} from "../models/activityType";
import {statuses} from "../models/statuses";
import {icons} from "../models/icons";

export default class SettingsWindow extends JetView {
	config() {
		const view = {
			view: "window",
			modal: true,
			width: 500,
			position: "center",
			head: {
				localId: "header",
				template: "#state#"
			},
			body: {
				view: "form",
				localId: "settingsForm",
				elements: [
					{view: "text", label: "Value", name: "Value"},
					{
						view: "combo",
						label: "Icon",
						name: "Icon",
						options: {
							data: icons,
							template: obj => `${obj.value}`,
							body: {
								template: obj => `<span class="mdi mdi-${obj.value}"></span>`
							}
						},
						validate: webix.rules.isNotEmpty,
						invalidMessage: "Can not be empty"
					},
					{
						cols: [
							{},
							{
								view: "button",
								label: "",
								css: "button--style",
								localId: "actionsButton",
								click: () => this.addEditActivity()
							},
							{
								view: "button",
								css: "button--style",
								label: "Cancel",
								click: () => this.closeModalWindow()
							}
						]
					}
				]
			}
		};
		return view;
	}

	init() {
		this.form = this.$$("settingsForm");
	}

	showModalWindow(table, id) {
		let state;
		this.table = table;
		if (id) {
			const item = this.table === "ActivityTypes" ? activityType.getItem(id) : statuses.getItem(id);
			state = "Edit";
			this.form.setValues(item);
		}
		else {
			state = "Add";
		}
		this.$$("header").setValues({state});
		this.$$("actionsButton").setValue(state);

		this.getRoot().show();
	}

	closeModalWindow() {
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	addEditActivity() {
		const data = this.form.getValues();
		if (!this.form.validate()) {
			webix.message({type: "error", text: "Please check fields"});
			return;
		}
		if (data.id) {
			if (this.table === "ActivityTypes") {
				activityType.updateItem(data.id, data);
			}
			else {
				statuses.updateItem(data.id, data);
			}
		}
		else if (this.table === "ActivityTypes") {
			activityType.add(data, 0);
		}
		else {
			statuses.add(data, 0);
		}
		this.closeModalWindow();
	}
}
