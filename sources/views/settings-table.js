import {JetView} from "webix-jet";
import {activityType} from "../models/activityType";
import {statuses} from "../models/statuses";

import SettingsWindow from "./settings-window";

export default class Table extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._tableData = data;
		this.name = name;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const dataTable = {
			view: "datatable",
			localId: "dataTable",
			fillspace: true,
			hover: "row--hover",
			columns: [
				{id: "Value", header: _("Value"), fillspace: true, editor: "text"},
				{
					id: "Icon",
					header: _("Icon"),
					adjust: true,
					template: obj => `<span class='mdi mdi-${obj.Icon}'></span>`
				},
				{
					id: "edit",
					header: "",
					adjust: true,
					template: "<span class='edit-btn webix_icon wxi-pencil'></span>"
				},
				{
					id: "delete",
					header: "",
					adjust: true,
					template: "<span class='remove-btn webix_icon wxi-trash'></span>"
				}
			],
			onClick: {
				"wxi-pencil": (e, id) => this.showEditModal(id),
				"wxi-trash": (e, id) => this.deleteItem(id)
			}
		};
		const addButton = {
			view: "button",
			width: 200,
			css: "button--style",
			label: _("Add"),
			type: "icon",
			icon: "wxi-plus-circle",
			click: () => this.showAddModal()
		};

		const view = {
			rows: [dataTable, {cols: [addButton, {}]}]
		};

		return view;
	}

	init() {
		this.$$("dataTable").sync(this._tableData);
		this.settingsWindow = this.ui(SettingsWindow);
	}

	showEditModal(id) {
		if (id) {
			this.settingsWindow.showModalWindow(this.name, id);
		}
	}

	showAddModal() {
		this.settingsWindow.showModalWindow(this.name);
	}

	deleteItem(id) {
		if (id && this.name === "ActivityTypes") {
			webix.confirm("Are you sure?").then(() => {
				activityType.remove(id);
			});
		}
		if (id && this.name === "Statuses") {
			webix.confirm("Are you sure?").then(() => {
				statuses.remove(id);
			});
		}
	}
}
