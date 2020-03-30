import {JetView} from "webix-jet";
import {activityType} from "../models/activityType";
import {statuses} from "../models/statuses";

import Table from "./settings-table";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const changeLanguageButtons = {
			view: "segmented",
			localId: "languages",
			value: this.app.getService("locale").getLang(),
			options: [
				{
					id: "en",
					value: _("EN")
				},
				{
					id: "ru",
					value: _("RU")
				}
			],
			click: () => {
				const language = this.language.getValue();
				this.app.getService("locale").setLang(language);
			}
		};
		const tabbar = {
			rows: [
				{
					view: "tabbar",
					localId: "settingTabbar",
					value: _("ActivityTypes"),
					options: [
						{value: _("Activity Types"), id: "ActivityTypes"},
						{value: _("Statuses"), id: "Statuses"}
					],
					on: {onChange: value => this.$$(value).show()}
				},
				{
					cells: [
						{localId: "ActivityTypes", rows: [new Table(this.app, "ActivityTypes", activityType)]},
						{localId: "Statuses", rows: [new Table(this.app, "Statuses", statuses)]}
					]
				}
			]
		};

		const view = {
			type: "clean",
			rows: [tabbar, {}, changeLanguageButtons]
		};
		return view;
	}

	init() {
		this.language = this.$$("languages");
	}
}
