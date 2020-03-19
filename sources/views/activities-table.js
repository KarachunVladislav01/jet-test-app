import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activityType";
import {contacts} from "../models/contacts";

import ActivityWindow from "./activity-window";

export default class Activities extends JetView {
	config() {
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
					header: [{text: "Activity type"}, {content: "selectFilter"}],
					sort: "text",
					collection: activityType,
					adjust: true
				},
				{
					id: "DueDate",
					header: [
						{text: "Due date"},
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
					header: [{text: "Details"}, {content: "textFilter"}],
					sort: "string",
					adjust: true,
					fillspace: true
				},
				{
					id: "ContactID",
					header: [{text: "Contact"}, {content: "selectFilter"}],
					sort: "text",
					collection: contacts,
					adjust: true
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
					label: "Add activity",
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => this.showAddModal()
				}
			]
		};

		const view = {
			rows: [addButton, dataTable]
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
