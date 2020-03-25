import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {files} from "../models/files";

export default class FilesOfContact extends JetView {
	config() {
		const dataTable = {
			view: "datatable",
			localId: "filesTable",
			fillspace: true,
			hover: "row--hover",
			columns: [
				{
					id: "name",
					header: "Name",
					sort: "text",
					adjust: true,
					fillspace: true
				},
				{
					id: "modificationDate",
					header: "Change date",
					sort: "date",
					format: webix.i18n.longDateFormatStr,
					adjust: true
				},
				{
					id: "sizeText",
					header: "Size",
					sort: this.sortBySize,
					adjust: true
				},

				{
					header: "",
					width: 60,
					template: "<span class='remove-btn webix_icon wxi-trash'></span>"
				}
			],
			onClick: {
				"wxi-trash": (e, id) => this.deleteFile(id)
			}
		};

		const uploader = {
			css: "activities_button",
			cols: [
				{},
				{
					view: "uploader",
					autosend: false,
					localId: "fileUploader",
					width: 200,
					css: "button--style",
					label: "Upload file",
					type: "icon",
					icon: "wxi-plus-circle"
				},
				{}
			]
		};

		const view = {
			rows: [dataTable, uploader]
		};

		return view;
	}

	init() {
		this.$$("filesTable").sync(files);
		this.$$("fileUploader").attachEvent("onBeforeFileAdd", (file) => {
			const data = {
				name: file.name,
				modificationDate: file.file.lastModifiedDate,
				size: file.size,
				sizeText: file.sizetext,
				ContactId: this.getParam("id", true)
			};
			files.add(data);
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const contactId = this.getParam("id", true).toString();
			if (!contactId && !contacts.exists(contactId)) {
				return;
			}
			files.data.filter(item => item.ContactId.toString() === contactId);
		});
	}

	deleteFile(id) {
		if (id) {
			webix.confirm("Are you sure?").then(() => {
				files.remove(id);
			});
		}
	}

	sortBySize(first, second) {
		return first.size - second.size;
	}
}
