export class DateHelper {
	
	public static getStartOfWeek(date = new Date()) {
		const d = new Date(date);
		d.setDate(d.getDate() - d.getDay() + 1);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getEndOfWeek(date = new Date()) {
		const d = new Date(date);
		d.setDate(d.getDate() - d.getDay() + 8);
		d.setUTCHours(0,0,0,0);
		return d;
	}
}

