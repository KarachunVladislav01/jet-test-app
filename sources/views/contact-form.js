import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";

import noPhoto from "../assets/img/noPhoto.png";

export default class ContactForm extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "contactForm",
			elements: [
				{
					view: "label",
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
											name: "Photo",
											template: contact => `<div class="user-info-photo">
											<img src=${contact.Photo || noPhoto} alt="User photo" /></div>`,
											localId: "contactPhoto"
										},
										{
											rows: [
												{
													view: "button",
													label: "Change photo",
													css: "button--style"
												},
												{
													view: "button",
													label: "Delete photo",
													css: "button--style"
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
						{view: "button", label: "Cancel", css: "button--style"},
						{
							view: "button",
							label: "Delete photo",
							css: "button--style",
							localId: "actionsButton"
						}
					]
				}
			]
		};
		return form;
	}
}
