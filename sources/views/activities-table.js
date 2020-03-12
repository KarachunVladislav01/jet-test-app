import { JetView } from "webix-jet";
import { activities } from "../models/activities.js";

export default class Activities extends JetView {
	config() {
		const dataTable = {
			view: "datatable",
			id: "activitiesTable",
			fillspace: true,
			hover: "row--hover",
			data: activities,
			columns: [
				{ id: "id", header: "", sort: "int", width: 40, css: "column--id" },
				{
					id: "TypeID",
					header: [{ text: "Activity type" }, { content: "selectFilter" }],
					sort: "string",
					adjust: true
				},
				{
					id: "DueDate",
					header: [{ text: "Due date" }, { content: "dateFilter" }],
					sort: "string",
					adjust: true
				},
				{
					id: "Details",
					header: [{ text: "Details" }, { content: "textFilter" }],
					sort: "string",
					adjust: true,
					fillspace: true
				},
				{
					id: "ContactID",
					header: [{ text: "Contact" }, { content: "selectFilter" }],
					sort: "string",
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
			]
		};

		return dataTable;
	}
}
