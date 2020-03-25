import {JetView, plugins} from "webix-jet";

export default class SideMenu extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const header = {
			type: "header",
			template: this.app.config.name,
			css: "webix_header app_header"
		};
		const sideMenu = {
			view: "menu",
			id: "menu",
			css: "app_menu",
			width: 180,
			select: true,
			layout: "y",
			template: "<span class='webix_icon #icon#'></span> #value# ",
			type: {width: 160},
			data: [
				{value: _("Contacts"), id: "contacts", icon: "wxi-user"},
				{value: _("Activities"), id: "activities-table", icon: "wxi-folder"},
				{value: _("Settings"), id: "settings", icon: "wxi-dots"}
			]
		};

		const view = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [sideMenu, {type: "wide", paddingY: 10, paddingX: 5, rows: [{$subview: true}]}]
				}
			]
		};

		return view;
	}

	init() {
		this.use(plugins.Menu, "menu");
	}
}
