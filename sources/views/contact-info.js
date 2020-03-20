import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

import ContactForm from "./contact-form";
import noPhoto from "../assets/img/noPhoto.png";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const formButtons = {
			cols: [
				{view: "button", label: _("Delete"), css: "button--style"},
				{
					view: "button",
					label: _("Edit"),
					css: "button--style",
					click: () => this.showContactEdit()
				}
			]
		};
		const userInfo = {
			view: "template",
			localId: "userInfo",
			template: contact => `
			<div class="user-info-grid">
			<div class ="contact-info--name">${contact.FirstName} ${contact.LastName}</div>
			<div class = "user-info-body-grid">
				<div class="user-info-photo"><img src=${contact.Photo || noPhoto} alt="User photo" /></div>
				<div class="user-info--col">
					<div id="user-mail">
						<span class="webix_icon mdi mdi-email"></span>
						<span>${contact.Email || "no data"}</span>
					</div>
					<div id="user-skype">
						<span class="webix_icon mdi mdi-skype"></span>
						<span>${contact.Skype || "no data"}</span>
					</div>
					<div id="user-job">
						<span class="webix_icon mdi mdi-account-card-details"></span>
						<span>${contact.Job || "no data"}</span>
					</div>
					<div id="user-company">
						<span class="webix_icon mdi mdi-briefcase"></span>
						<span>${contact.Company || "no data"}</span>
					</div>
				</div>
				<div class="user-info--col">
					<div id="user-birth">
						<span class="webix_icon mdi mdi-calendar"></span>
						<span>${contact.Birthday || "no data"}</span>
					</div>
					<div id="user-location">
						<span class="webix_icon mdi mdi-city"></span>
						<span>${contact.Address || "no data"}</span>
					</div>
				</div>
			</div>
			<div><span class="user-info--status">${contact.Status || "no data"}</span></div>
		</div>
		</div>`
		};

		const view = {rows: [formButtons, userInfo]};

		return view;
	}

	init() {
		this.info = this.$$("userInfo");
		this.contactForm = this.ui(ContactForm);
	}

	showContactEdit() {
		const id = this.getParam("id", true);
		// this.show("./contact-form");
		this.contactForm.showContactForm(id);
	}

	urlChange() {
		const elementId = this.getParam("id", true);

		statuses.waitData.then(() => {
			if (contacts.exists(elementId)) {
				const contact = webix.copy(contacts.getItem(elementId));
				const statusId = contact.StatusID;

				if (statuses.exists(statusId)) {
					contact.Status = statuses.getItem(statusId).Value;
				}
				this.info.setValues(contact);
			}
		});
	}
}
