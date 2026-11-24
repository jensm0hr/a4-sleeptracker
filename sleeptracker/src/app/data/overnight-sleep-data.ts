import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	public sleepStart:Date;
	public sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	toJSON() {
		return {
			id: this.id,
			loggedAt: this.loggedAt.toISOString(),
			sleepStart: this.sleepStart.toISOString(),
			sleepEnd: this.sleepEnd.toISOString()
		};
	}

	static fromJSON(obj: any): OvernightSleepData {
		const d = new OvernightSleepData(new Date(obj.sleepStart), new Date(obj.sleepEnd));
		d.id = obj.id;
		d.loggedAt = new Date(obj.loggedAt);
		return d;
	}
}
