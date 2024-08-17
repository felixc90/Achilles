import { Period } from "../types";

export class DateHelper {
	
	public static getStartOfDay(date = new Date()) {
		const d = new Date(date);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getStartOfWeek(date = new Date()) {
		const d = new Date(date);
		d.setDate(d.getDate() - d.getDay() + 1);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getStartOfMonth(date = new Date()) {
		const d = new Date(date);
		d.setDate(1);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getStartOfYear(date = new Date()) {
		const d = new Date(date);
		d.setMonth(1);
		d.setDate(1);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getEndOfWeek(date = new Date()) {
		const d = new Date(date);
		d.setDate(d.getDate() - d.getDay() + 8);
		d.setUTCHours(0,0,0,0);
		return d;
	}

	public static getStartOfPeriod(period: Period, date = new Date()) {
		switch (period) {
			case Period.Day:
				return this.getStartOfDay(date);
				break;
			case Period.Week:
				return this.getStartOfWeek(date);
				break;
			case Period.Month:
				return this.getStartOfMonth(date);
				break;
			case Period.Year:
				return this.getStartOfYear(date);
				break;
			default:
				break;
		}
		return new Date();
	}

	public static getStartOfPeriods(period: Period, count: number) {
		const res = [];
		let d = DateHelper.getStartOfPeriod(period);

		while (res.length < count) {
			res.push(d);
			d = new Date(d);
			switch (period) {
				case Period.Day:
					d.setDate(d.getDate() - 1);
					break;
				case Period.Week:
					d.setDate(d.getDate() - 7);
					break;
				case Period.Month:
					d.setMonth(d.getMonth() - 1);
					break;
				case Period.Year:
					d.setFullYear(d.getFullYear() - 1);
					break;
				default:
					break;
			}
		}
		return res.reverse();
	}
}

