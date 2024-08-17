import { Period } from "../types";

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

	public static getStartOfPeriods(period: Period, count: number) {
		const res = [];
		let d = DateHelper.getStartOfWeek();

		while (res.length < count) {
			res.push(d);
			console.log(d);
			d = new Date(d);
			switch (period) {
				case Period.Day:
					d.setDate(d.getDate() - 1);
					break;
				case Period.Week:
					d.setDate(d.getDate() - 7);
					break;
				default:
					break;
			}
		}
		return res.reverse();
	}
}

