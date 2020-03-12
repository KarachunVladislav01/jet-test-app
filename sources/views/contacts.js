import { JetView } from "webix-jet";
import { contacts } from "../models/contacts.js";

import ContactInfo from "./contact-info.js";

export default class Contact extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const usersList = {
			view: "list",
			localId: "userList",
			select: true,
			scroll: false,
			template:
				"<div class= 'users-list--flex'>{common.userName()}<br>{common.userCompany()} </div>",
			type: {
				height: 64,
				userName: obj => {
					return `<span>${obj.FirstName} ${obj.LastName}</span>`;
				},
				userCompany: obj => {
					return `<span>${obj.Company}</span>`;
				}
			},
			onClick: {
				"wxi-close": (e, id) => this.deleteContact(id)
			}
		};

		const view = {
			margin: 20,
			cols: [usersList, ContactInfo]
		};
		return view;
	}
	init(view, url) {
		this.list = this.$$("userList");
		this.list.sync(contacts);

		contacts.waitData.then(() => {
			this.list.attachEvent("onAfterSelect", chosenId =>
				this.show(`./contacts?id=${chosenId}`)
			);
			let id = url[0].params.id;
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
			}
			this.list.select(id);
		});
	}

	deleteContact(id) {}
}
