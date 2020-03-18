const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

function setTime(obj) {
	const hours = obj.DueTime.getHours();
	const minutes = obj.DueTime.getMinutes();
	obj.DueDate.setHours(hours, minutes);
}
export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(item) {
			const date = item.DueDate;
			if (!date) {
				return;
			}
			if (typeof date !== "object") {
				item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
			} else if (item.DueTime) {
				setTime(item);
			}
		},
		$update: item => {
			if (item.DueTime) {
				setTime(item);
			}
		},
		$save: item => {
			if (item.DueDate) {
				item.DueDate = dateToStr(item.DueDate);
			}
		}
	}
});
