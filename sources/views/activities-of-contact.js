import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activityType";
import {contacts} from "../models/contacts";

import ActivityWindow from "./activity-window";

export default class ActivitiesOfContact extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const dataTable = {
			view: "datatable",
			localId: "activitiesTable",
			fillspace: true,
			hover: "row--hover",
			columns: [
				{
					id: "State",
					header: "",
					width: 40,
					template: "{common.checkbox()}",
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [{text: _("Activity Types")}, {content: "richSelectFilter"}],
					sort: "text",
					template: (obj) => {
						const item = activityType.getItem(obj.TypeID);
						return `<div class="activity--flex">${item.Value} <span class="mdi mdi-${item.Icon}"></span></div>`;
					},

					options: activityType,
					adjust: true
				},
				{
					id: "DueDate",
					header: [
						{text: _("Due date")},
						{
							content: "datepickerFilter",
							compare(cellValue, filterValue) {
								const dateToStr = webix.i18n.dateFormatStr(cellValue);
								const filterToStr = webix.i18n.dateFormatStr(filterValue);
								if (dateToStr === filterToStr) {
									return true;
								}
								return false;
							}
						}
					],
					sort: "date",
					format: webix.i18n.longDateFormatStr,
					adjust: true
				},
				{
					id: "Details",
					header: [{text: _("Details")}, {content: "textFilter"}],
					sort: "string",
					adjust: true,
					fillspace: true
				},
				{
					header: "",
					width: 60,
					template: "<span class='edit-btn webix_icon wxi-pencil'></span>"
				},
				{
					header: "",
					width: 60,
					template: "<span class='remove-btn webix_icon wxi-trash'></span>"
				}
			],
			onClick: {
				"wxi-pencil": (e, id) => this.showEditModal(id),
				"wxi-trash": (e, id) => this.deleteItem(id)
			}
		};
		const addButton = {
			css: "activities_button",
			cols: [
				{},
				{
					view: "button",
					width: 200,
					css: "button--style",
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => this.showAddModal()
				}
			]
		};

		const view = {
			rows: [dataTable, addButton]
		};

		return view;
	}

	init() {
		this.table = this.$$("activitiesTable");
		this.activityWindow = this.ui(ActivityWindow);
		webix.promise.all([activities.waitData, activityType.waitData, contacts.waitData]).then(() => {
			this.table.sync(activities);
		});
	}

	urlChange() {
		webix.promise.all([activities.waitData, activityType.waitData, contacts.waitData]).then(() => {
			const contactId = this.getParam("id", true).toString();
			if (!contactId && !contacts.exists(contactId)) {
				return;
			}
			activities.data.filter(item => item.ContactID.toString() === contactId);
		});
	}

	showEditModal(id) {
		if (id) {
			this.activityWindow.showModalWindow(id);
		}
	}

	showAddModal() {
		this.activityWindow.showModalWindow();
	}

	deleteItem(id) {
		if (id) {
			webix.confirm("Are you sure?").then(() => {
				activities.remove(id);
			});
		}
	}
}
