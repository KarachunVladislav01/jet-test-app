import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

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

		const addButton = {
			view: "button",
			label: "Add contact",
			css: "button--style",
			click: () => this.show("./contact-form?status=add")
		};

		const view = {
			margin: 20,
			cols: [{rows: [usersList, addButton]}, {$subview: true}]
		};
		return view;
	}

	init() {
		this.list = this.$$("userList");
		this.list.sync(contacts);

		this.on(this.app, "contactEdit", () => {
			this.show("./contact-form?status=edit");
		});

		this.on(this.app, "showChoosenContactInfo", (id) => {
			this.list.select(id);
			this.show("./contact-info");
		});

		this.list.attachEvent("onAfterSelect", chosenId => this.setParam("id", chosenId, true));

		contacts.waitData.then(() => {
			let id = this.getParam("id");
			if (!contacts.exists(id)) {
				id = contacts.getFirstId();
			}
			this.app.callEvent("showChoosenContactInfo", [id]);
		});
	}
}
