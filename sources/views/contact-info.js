import { JetView } from "webix-jet";
import { contacts } from "models/contacts.js";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const formButtons = {
			cols: [
				{ view: "button", label: _("Delete"), css: "contact-button" },
				{ view: "button", label: _("Edit"), css: "contact-button" }
			]
		};
		const userInfo = {
			id: "userInfo",
			rows: [
				{
					cols: [
						{
							template: "#FirstName# #Surname#",
							css: "contact-info--name",
							name: "FirstName"
						},
						formButtons
					]
				},
				{
					cols: [
						{
							template: function(obj) {
								return '<img src="' + obj.src + '"/>';
							},
							borderless: true,
							data: { title: "placeholder", src: "./sources/assets/img/150.png" }
						},
						{
							view: "template",
							css: "user-info--col1",
							template: "html->user-info--col1",
							borderless: true
						},
						{
							view: "template",
							template: "html->user-info--col2",
							borderless: true,
							height: 200
						}
					]
				},
				{ template: "Status", borderless: true, height: 40 }
			]
		};

		const view = { rows: [userInfo, {}] };

		return view;
	}

	init() {
		this.info = this.$$("userInfo");
	}
	urlChange(view, url) {
		const elementId = url[0].params.id;
		if (contacts.exists(elementId)) {
			this.info.setValues(contacts.getItem(elementId));
		}
	}
	saveContact() {
		const data = this.form.getValues();
		let id = this.getParam("id");
		if (!id) {
			webix.message({ type: "error", text: "No contact selected" });
			return;
		}
		if (this.form.validate()) {
			contacts.updateItem(data.id, data);
			webix.message({ type: "success", text: "Successful" });
		} else {
			webix.message({ type: "error", text: "Invalid inputs" });
		}
	}
}
