export abstract class DateHelper {
	
	public static getStartOfWeek() {
		const d = new Date();
		d.setDate(d.getDate() - d.getDay() + 1);
		d.setUTCHours(0,0,0,0);

		return d.toISOString();
	}
}

