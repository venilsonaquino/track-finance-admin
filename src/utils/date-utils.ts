export class DateUtils {
	static getMonthStartAndEnd(date: Date) {
		const year = date.getFullYear();
		const month = date.getMonth();

		const startDate = new Date(year, month, 1);
		const endDate = new Date(year, month + 1, 0);

		return {
			startDate: startDate.toISOString().split('T')[0],
			endDate: endDate.toISOString().split('T')[0],
		};
	}

	static formatToISODate(date: Date) {
		return date.toISOString().split('T')[0];
	}
}
