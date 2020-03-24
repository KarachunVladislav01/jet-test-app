const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");
function setFullName(item) {
	item.value = `${item.FirstName}, ${item.LastName}`;
}
function setDates(item) {
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
}

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (item) => {
			setFullName(item);
			setDates(item);
		},
		$update: (item) => {
			setFullName(item);
			setDates(item);
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
