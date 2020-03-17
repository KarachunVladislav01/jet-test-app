import { JetView } from "webix-jet";
import { activities } from "../models/activities.js";
import { activityType } from "../models/activityType.js";
import { contacts } from "../models/contacts.js";

export default class ActivityWindow extends JetView {
	config() {
		const view = {
			view: "window",
			modal: true,
			width: 500,
			position: "center",
			head: {
				localId: "header",
				template: "#state# activity"
			},
			body: {
				view: "form",
				localId: "activityForm",
				elements: [
					{ view: "textarea", label: "Details", name: "Details" },
					{
						view: "combo",
						label: "Type",
						name: "TypeID",
						options: activityType,
						validate: webix.rules.isNotEmpty,
						invalidMessage: "Can not be empty"
					},
					{
						view: "combo",
						label: "Contact",
						name: "ContactID",
						options: contacts,
						validate: webix.rules.isNotEmpty,
						invalidMessage: "Can not be empty"
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "DueDate",
								format: webix.i18n.longDateFormatStr,
								validate: webix.rules.isNotEmpty,
								invalidMessage: "Can not be empty"
							},
							{
								view: "datepicker",
								name: "DueTime",
								type: "time",
								format: webix.i18n.timeFormat,
								validate: webix.rules.isNotEmpty,
								invalidMessage: "Can not be empty"
							}
						]
					},
					{
						view: "checkbox",
						label: "Completed",
						name: "State",
						checkValue: "Close",
						uncheckValue: "Open"
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
		this.form = this.$$("activityForm");
	}
	showModalWindow(id) {
		let state;
		if (id && activities.exists(id)) {
			state = "Edit";
			const item = webix.copy(activities.getItem(id));
			item.DueTime = item.DueDate;
			this.form.setValues(item);
		} else {
			state = "Add";
		}
		this.$$("header").setValues({ state });
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
			webix.message({ type: "error", text: "Please check fields" });
			return;
		}

		if (data.id) {
			activities.updateItem(data.id, data);
		} else {
			activities.add(data, 0);
		}
		this.closeModalWindow();
	}
}
