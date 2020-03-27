import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activityType";
import {contacts} from "../models/contacts";

export default class ActivityWindow extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
					{view: "textarea", label: _("Details"), name: "Details"},
					{
						view: "combo",
						label: _("Type"),
						name: "TypeID",
						options: activityType,
						validate: webix.rules.isNotEmpty,
						invalidMessage: "Can not be empty"
					},
					{
						view: "combo",
						localId: "contactsCombo",
						label: _("Contact"),
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
						label: _("Completed"),
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
		const contactId = this.getParam("id", true);

		if (contactId) {
			const contactsName = this.$$("contactsCombo");
			contactsName.setValue(contacts.getItem(contactId));
			contactsName.disable();
		}
		if (id && activities.exists(id)) {
			state = "Edit";
			const item = webix.copy(activities.getItem(id));
			item.DueTime = item.DueDate;
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
			activities.updateItem(data.id, data);
		}
		else {
			activities.add(data, 0);
		}
		this.closeModalWindow();
	}
}
