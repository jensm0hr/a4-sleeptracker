import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	private storageReady: Promise<void>;

	constructor(private storage: Storage) {
		this.storageReady = this.init();
	}

	private async init() {
		await this.storage.create();
		const overnight = (await this.storage.get('overnight')) ?? [];
		const sleepiness = (await this.storage.get('sleepiness')) ?? [];

		SleepService.AllOvernightData = overnight.map(OvernightSleepData.fromJSON);
		SleepService.AllSleepinessData = sleepiness.map(StanfordSleepinessData.fromJSON);
		this.rebuildAllData();
	}

	private rebuildAllData() {
		SleepService.AllSleepData = [
			...SleepService.AllOvernightData,
			...SleepService.AllSleepinessData
		].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	private async persist() {
		await this.storageReady;
		await this.storage.set('overnight', SleepService.AllOvernightData.map(d => d.toJSON()));
		await this.storage.set('sleepiness', SleepService.AllSleepinessData.map(d => d.toJSON()));
	}

	public async logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllOvernightData.push(sleepData);
		this.rebuildAllData();
		await this.persist();
	}

	public async logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepinessData.push(sleepData);
		this.rebuildAllData();
		await this.persist();
	}

	public async deleteLog(id: string) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(d => d.id !== id);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d => d.id !== id);
		this.rebuildAllData();
		await this.persist();
	}

	public async restoreLog(log: SleepData) {
		if (log instanceof OvernightSleepData) {
			SleepService.AllOvernightData.push(log);
		}
		else if (log instanceof StanfordSleepinessData) {
			SleepService.AllSleepinessData.push(log);
		}
		this.rebuildAllData();
		await this.persist();
	}

	public findOvernightForWakeDate(wake: Date): OvernightSleepData | undefined {
		return SleepService.AllOvernightData.find(
			d => d.sleepEnd.toDateString() === wake.toDateString()
		);
	}
}
