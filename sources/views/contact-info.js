import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import {activities} from "../models/activities";
import {files} from "../models/files";

import ActivitiesOfContact from "./activities-of-contact";
import FilesOfContact from "./files-of-contact";
import noPhoto from "../assets/img/noPhoto.png";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const formButtons = {
			cols: [
				{
					view: "button",
					label: _("Delete"),
					css: "button--style",
					click: () => this.confirmDeleteContact()
				},
				{
					view: "button",
					label: _("Edit"),
					css: "button--style",
					click: () => this.app.callEvent("contactEdit")
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

		const bottomTabbar = {
			rows: [
				{
					view: "tabbar",
					localId: "contactsData",
					value: "Activities",
					options: [
						{value: _("Activities"), id: "activities"},
						{value: _("Files"), id: "files"}
					]
				},
				{
					cells: [
						{localId: "activities", rows: [ActivitiesOfContact]},
						{localId: "files", rows: [FilesOfContact]}
					]
				}
			]
		};

		const view = {rows: [formButtons, userInfo, bottomTabbar]};

		return view;
	}

	init() {
		this.info = this.$$("userInfo");
		this.$$("contactsData").attachEvent("onChange", value => this.$$(value).show());
	}

	urlChange() {
		const elementId = this.getParam("id", true);

		statuses.waitData.then(() => {
			if (!contacts.exists(elementId)) {
				return;
			}

			const contact = webix.copy(contacts.getItem(elementId));
			const statusId = contact.StatusID;
			contact.Birthday = webix.i18n.longDateFormatStr(contact.Birthday);
			if (statuses.exists(statusId)) {
				contact.Status = statuses.getItem(statusId).Value;
			}
			this.info.setValues(contact);
		});
	}

	confirmDeleteContact() {
		const id = this.getParam("id", true);
		if (!id && !contacts.exists(id)) {
			return;
		}
		this.webix
			.confirm({
				type: "confirm-warning",
				text: "Are you sure?"
			})
			.then(() => {
				this.deleteContact(id);
			});
	}

	deleteContact(id) {
		const activitiesToRemove = activities.find(
			item => item.ContactID.toString() === id.toString()
		);
		const activitiesToRemoveIds = activitiesToRemove.map(item => item.id);
		activities.remove(activitiesToRemoveIds);

		const filesToRemove = files.find(item => item.ContactId.toString() === id.toString());
		const filesToRemoveIds = filesToRemove.map(item => item.id);
		files.remove(filesToRemoveIds);

		contacts.remove(id);

		this.app.callEvent("showChoosenContactInfo", [contacts.getFirstId()]);
	}
}
