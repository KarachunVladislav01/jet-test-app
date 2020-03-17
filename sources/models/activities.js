export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(item) {
			if (item.DueDate) {
				item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
			}
		},
		$save: item => {
			if (item.DueDate) {
				item.DueDate = webix.i18n.parseFormatStr(item.DueDate);
			}
		}
	}
});
