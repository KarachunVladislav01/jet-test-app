import { JetView } from "webix-jet";
import { contacts } from "../models/contacts.js";
import { statuses } from "../models/statuses.js";

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
			view: "template",
			localId: "userInfo",
			template: contact => {
				return `
			<div class="user-info-grid">
			<div class ="contact-info--name">${contact.FirstName} ${contact.LastName}</div>
			<div class = "user-info-body-grid">
				<div><img src="./sources/assets/img/150.png" alt="User photo" /></div>
				<div class="user-info--col">
					<div id="user-mail">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Email || "no data"}</span>
					</div>
					<div id="user-skype">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Skype || "no data"}</span>
					</div>
					<div id="user-job">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Job || "no data"}</span>
					</div>
					<div id="user-company">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Company || "no data"}</span>
					</div>
				</div>
				<div class="user-info--col">
					<div id="user-birth">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Birthday || "no data"}</span>
					</div>
					<div id="user-location">
						<span class="webix_icon wxi-user"></span>
						<span>${contact.Address || "no data"}</span>
					</div>
				</div>
			</div>
			<div><span class="user-info--status">${contact.Status || "no data"}</span></div>
		</div>
		</div>`;
			}
		};

		const view = userInfo;

		return view;
	}

	init() {
		this.info = this.$$("userInfo");
	}
	urlChange(view, url) {
		const elementId = url[0].params.id;

		statuses.waitData.then(() => {
			if (contacts.exists(elementId)) {
				const contact = contacts.getItem(elementId);
				const statusId = contact.StatusID;

				if (statuses.exists(statusId)) {
					contact.Status = statuses.getItem(statusId).Value;
				}
				this.info.setValues(contact);
			}
		});
	}
	saveContact() {}
}
