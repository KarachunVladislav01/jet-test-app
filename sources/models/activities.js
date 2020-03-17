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
			const dateToStrDate = webix.Date.dateToStr("%Y-%m-%d");
			const dateToStrTime = webix.Date.dateToStr("%H:%i");
			item.DueDate = `${dateToStrDate(item.DueDate)} ${dateToStrTime(item.DueTime)}`;
		},
		$save: item => {
			if (item.DueDate) {
				item.DueDate = dateToStr(item.DueDate);
			}
		}
	}
});
