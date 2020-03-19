import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

import ContactInfo from "./contact-info";
import noPhoto from "../assets/img/noPhoto.png";

export default class Contact extends JetView {
	config() {
		const usersList = {
			view: "list",
			localId: "userList",
			width: 300,
			select: true,
			scroll: false,
			template: obj => `
						<div class="user-list--grid">
							<div class="user-list-photo"><img src=${obj.Photo || noPhoto} alt="User photo" /></div>
							<div><span>${obj.value}</span><br /><span>${obj.Company}</span></div>
						</div>
						`,
			type: {
				height: 100
			}
		};

		const view = {
			margin: 20,
			cols: [usersList, ContactInfo]
		};
		return view;
	}

	init() {
		this.list = this.$$("userList");
		this.list.sync(contacts);
		this.list.attachEvent("onAfterSelect", chosenId => this.show(`./contacts?id=${chosenId}`));
		contacts.waitData.then(() => {
			let id = this.getParam("id");
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
			}
			this.list.select(id);
		});
	}
}
