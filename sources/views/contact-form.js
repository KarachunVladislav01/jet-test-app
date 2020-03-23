import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {contacts} from "../models/contacts";

import noPhoto from "../assets/img/noPhoto.png";

export default class ContactForm extends JetView {
	config() {
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
									label: "First name",
									name: "FirstName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: "Joining date",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "combo",
									label: "Status",
									name: "StatusID",
									options: statuses,
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Job",
									name: "Job",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Company",
									name: "Company",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Website",
									name: "Website",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Address",
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
									label: "Email",
									name: "Email",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone",
									validate: webix.rules.isNotEmpty,
									invalidMessage: "Can not be empty"
								},
								{
									view: "datepicker",
									label: "Birthday",
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
													label: "Change photo",
													accept: "image/png, image/jpg, image/jpeg",
													autosend: false,
													css: "button--style"
												},
												{
													view: "button",
													label: "Delete photo",
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
						{view: "button", label: "Cancel", css: "button--style", click: () => this.closeForm()},
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

		this.$$("photoUploader").attachEvent("onBeforeFileAdd", (data) => {
			fileReader.readAsDataURL(data.file);
			fileReader.onload = () => this.contactPhoto.setValues({Photo: fileReader.result});
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
		if (id && contacts.exists(id)) {
			state = "Edit";
			const item = webix.copy(contacts.getItem(id));
			this.form.setValues(item);
			this.contactPhoto.setValues({Photo: item.Photo});
		}
		else {
			state = "Add";
		}
		this.$$("header").setValues({state});
		this.$$("actionsButton").setValue(state);
	}

	closeForm(id) {
		this.form.clear();
		this.form.clearValidation();
		const status = this.getParam("status");
		if (status === "edit") {
			this.show("./contact-info");
		}
		else if (id) {
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
			.then(() => {
				this.closeForm();
			});
	}

	deletePhoto() {
		this.contactPhoto.setValues({Photo: ""});
	}
}
