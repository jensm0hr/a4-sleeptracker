import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton,
  IonModal, IonListHeader, IonNote, IonSegment, IonSegmentButton, AlertController, 
  ToastController
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

// ion-datetime wants a local ISO string without a timezone suffix
function toLocalISO(d: Date): string {
  const offsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 19);
}

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonSelect, IonSelectOption, IonDatetime,
    IonDatetimeButton, IonModal, IonListHeader, IonNote, IonSegment, IonSegmentButton
  ],
})
export class LogPage {
  bedtime: string;
  wakeTime: string;
  sleepinessValue: number | null = null;
  sleepinessTime: string;
  selectedForm: 'overnight' | 'sleepiness' = 'overnight';

  scaleOptions = [1, 2, 3, 4, 5, 6, 7].map(n => ({
    value: n,
    label: StanfordSleepinessData.ScaleValues[n]
  }));

  constructor(private sleepService: SleepService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
    const now = new Date();
    const lastNight = new Date(now);
    lastNight.setDate(now.getDate() - 1);
    lastNight.setHours(23, 0, 0);
    const thisMorning = new Date(now);
    thisMorning.setHours(7, 0, 0);

    this.bedtime = toLocalISO(lastNight);
    this.wakeTime = toLocalISO(thisMorning);
    this.sleepinessTime = toLocalISO(now);
  }

  get overnightValid(): boolean {
    return new Date(this.wakeTime) > new Date(this.bedtime);
  }

  get sleepinessValid(): boolean {
    return this.sleepinessValue !== null;
  }

  async saveOvernight() {
    if (!this.overnightValid) return;
    const entry = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeTime));
    const existing = this.sleepService.findOvernightForWakeDate(entry.sleepEnd);

    if (existing) {
      const alert = await this.alertCtrl.create({
        header: 'Replace existing entry?',
        message: 'You already logged sleep for that morning (' + existing.summaryString() + ').',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Replace',
            role: 'destructive',
            handler: async () => {
              await this.sleepService.deleteLog(existing.id);
              await this.sleepService.logOvernightData(entry);
              this.showSaved('Sleep replaced');
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    await this.sleepService.logOvernightData(entry);
    this.showSaved('Sleep saved');
  }

  async saveSleepiness() {
    if (!this.sleepinessValid) return;
    await this.sleepService.logSleepinessData(
      new StanfordSleepinessData(this.sleepinessValue!, new Date(this.sleepinessTime))
    );
    this.sleepinessValue = null;
    this.sleepinessTime = toLocalISO(new Date());
    this.showSaved('Sleepiness saved');
  }

  // No loggin the future
  maxTime: string = toLocalISO(new Date());

  // Tab pages stay alive
  ionViewWillEnter() {
    this.maxTime = toLocalISO(new Date());
  }

  get durationHours(): number {
    return (new Date(this.wakeTime).getTime() - new Date(this.bedtime).getTime()) / 3600000;
  }

  // Warning for unusual sleep durations
  get durationWarning(): string | null {
    if (!this.overnightValid) return null;
    if (this.durationHours < 1) return 'That is under 1 hour of sleep. Double-check your times.';
    if (this.durationHours > 16) return 'That is over 16 hours of sleep. Double-check your times.';
    return null;
  }

  private async showSaved(message: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000, position: 'bottom', color: 'success'
    });
    await toast.present();
  }
}