export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(item) {
			item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
			item.DueTime = webix.Date.timePart(item.DueDate);
		}
	}
});
