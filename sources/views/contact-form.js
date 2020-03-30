import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {contacts} from "../models/contacts";

import noPhoto from "../assets/img/noPhoto.png";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const form = {
			view: "form",
			localId: "contactForm",
			elements: [
				{
					view: "template",
					localId: "header",
					height: 70,
					borderless: true,
					template: "#state# activity"
				},
				{
					margin: 50,
					cols: [
						{
							margin: 20,
							rows: [
								{
									view: "text",
									label: _("First name"),
									name: "FirstName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Last name"),
									name: "LastName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: _("Joining date"),
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "combo",
									label: _("Status"),
									name: "StatusID",
									options: statuses,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Job"),
									name: "Job",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Company"),
									name: "Company",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Website"),
									name: "Website",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Address"),
									name: "Address",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								}
							]
						},
						{
							margin: 20,
							rows: [
								{
									view: "text",
									label: _("Email"),
									name: "Email",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Skype"),
									name: "Skype",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: _("Phone"),
									name: "Phone",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: _("Birthday"),
									name: "Birthday",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									cols: [
										{
											type: "clean",
											localId: "contactPhoto",
											name: "Photo",
											height: 200,
											gravity: 2,
											template: contact => `<div class="user-info-photo">
											<img src=${contact.Photo || noPhoto} alt="User photo" /></div>`
										},
										{
											rows: [
												{},
												{
													view: "uploader",
													localId: "photoUploader",
													label: _("Change photo"),
													accept: "image/png, image/jpg, image/jpeg",
													autosend: false,
													css: "button--style"
												},
												{
													view: "button",
													label: _("Delete photo"),
													css: "button--style",
													click: () => this.deletePhoto()
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{},
				{
					cols: [
						{
							view: "button",
							label: _("Cancel"),
							css: "button--style",
							click: () => this.closeForm()
						},
						{
							view: "button",
							label: "",
							css: "button--style",
							localId: "actionsButton",
							click: () => this.addEditContact()
						}
					]
				}
			]
		};
		return form;
	}

	init() {
		this.form = this.$$("contactForm");
		this.contactPhoto = this.$$("contactPhoto");
		const fileReader = new FileReader();
		fileReader.onload = () => this.contactPhoto.setValues({Photo: fileReader.result});

		this.$$("photoUploader").attachEvent("onBeforeFileAdd", (data) => {
			fileReader.readAsDataURL(data.file);
		});
	}

	urlChange() {
		const state = this.getParam("status");
		if (state === "edit") {
			const id = this.getParam("id", true);
			this.showContactForm(state, id);
		}
		else {
			this.showContactForm(state);
		}
	}

	showContactForm(state, id) {
		this.form.clearValidation();
		if (id && contacts.exists(id)) {
			const item = webix.copy(contacts.getItem(id));
			this.form.setValues(item);
			this.contactPhoto.setValues({Photo: item.Photo});
		}
		else {
			this.form.clear();
		}
		this.$$("header").setValues({state});
		this.$$("actionsButton").setValue(state);
	}

	closeForm(id) {
		this.form.clear();
		this.form.clearValidation();
		if (id) {
			this.app.callEvent("showChoosenContactInfo", [id]);
		}
		else {
			this.app.callEvent("showChoosenContactInfo", [contacts.getFirstId()]);
		}
	}

	addEditContact() {
		const data = this.form.getValues();
		data.Photo = this.contactPhoto.getValues().Photo;
		if (!this.form.validate()) {
			webix.message({type: "error", text: "Please check fields"});
			return;
		}
		contacts
			.waitSave(() => {
				if (data.id) {
					contacts.updateItem(data.id, data);
				}
				else {
					contacts.add(data, 0);
				}
			})
			.then((res) => {
				this.closeForm(res.id);
			});
	}

	deletePhoto() {
		this.contactPhoto.setValues({Photo: ""});
	}
}
