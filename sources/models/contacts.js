const dateToStr = webix.Date.dateToStr("%Y-%m-%d");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (item) => {
			item.value = `${item.FirstName}, ${item.LastName}`;
			const birthday = item.Birthday;
			const startDate = item.StartDate;
			if (!birthday && !startDate) {
				return;
			}
			if (typeof birthday !== "object") {
				item.Birthday = webix.i18n.parseFormatDate(item.Birthday);
			}
			if (typeof startDate !== "object") {
				item.StartDate = webix.i18n.parseFormatDate(item.StartDate);
			}
		},
		$save: (item) => {
			const birthday = item.Birthday;
			const startDate = item.StartDate;
			if (birthday) {
				item.Birthday = dateToStr(birthday);
			}
			if (startDate) {
				item.StartDate = dateToStr(startDate);
			}
		}
	}
});
