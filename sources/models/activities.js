const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(item) {
			if (item.DueDate) {
				item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
			}
		},
		$update: item => {
			const hours = item.DueTime.getHours();
			const minutes = item.DueTime.getMinutes();
			item.DueDate.setHours(hours, minutes);
		},
		$save: item => {
			if (item.DueDate) {
				item.DueDate = dateToStr(item.DueDate);
			}
		}
	}
});
