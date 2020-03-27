import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activityType";
import {contacts} from "../models/contacts";

import ActivityWindow from "./activity-window";

export default class Activities extends JetView {
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
					header: [{text: "Activity Types"}, {content: "selectFilter"}],
					sort: "text",
					collection: activityType,
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
					id: "ContactID",
					header: [{text: _("Contact")}, {content: "selectFilter"}],
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
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => this.showAddModal()
				}
			]
		};

		const filtersOptions = {
			view: "tabbar",
			localId: "activitiesFilters",
			value: "all",
			options: [
				{id: "all", value: _("All")},
				{id: "overdue", value: _("Overdue")},
				{id: "completed", value: _("Completed")},
				{id: "today", value: _("Today")},
				{id: "tomorrow", value: _("Tomorrow")},
				{id: "thisWeek", value: _("This week")},
				{id: "thisMonth", value: _("This month")}
			],
			on: {
				onChange: () => {
					this.$$("activitiesTable").filterByAll();
				}
			}
		};

		const view = {
			rows: [filtersOptions, dataTable, addButton]
		};

		return view;
	}

	init() {
		this.table = this.$$("activitiesTable");
		this.activityWindow = this.ui(ActivityWindow);

		webix.promise.all([activities.waitData, activityType.waitData, contacts.waitData]).then(() => {
			activities.data.filter();
			this.table.sync(activities);
		});

		this.table.registerFilter(
			this.$$("activitiesFilters"),
			{
				columnId: "State",
				compare: (value, filter, item) => this.activitiesFiltration(value, filter, item)
			},
			{
				getValue: node => node.getValue(),
				setValue: (node, value) => node.setValue(value)
			}
		);
	}

	activitiesFiltration(state, filter, item) {
		const now = new Date();
		switch (filter) {
			case "overdue":
				return item.DueDate < now && state === "Open";
			case "completed":
				return state === "Close";
			case "today":
				return webix.Date.equal(
					webix.Date.datePart(now, true),
					webix.Date.datePart(item.DueDate, true)
				);
			case "tomorrow":
				return webix.Date.equal(
					webix.Date.datePart(webix.Date.add(now, 1, "day", true), true),
					webix.Date.datePart(item.DueDate, true)
				);
			case "thisWeek":
				return (
					webix.Date.weekStart(now) < item.DueDate &&
					item.DueDate < webix.Date.add(webix.Date.weekStart(now), 8, "day", true)
				);
			case "thisMonth":
				return (
					webix.Date.monthStart(now) < item.DueDate &&
					item.DueDate < webix.Date.add(webix.Date.monthStart(now), 1, "month", true)
				);
			case "all":
				return state;
			default:
				webix.message({type: "error", text: "No filter"});
				return state;
		}
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
