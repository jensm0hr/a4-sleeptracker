import { Component, NgZone } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, moon, sunny } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonItemSliding, IonItemOptions, IonItemOption, IonIcon
  ],
})
export class HistoryPage {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private sleepService: SleepService,
    private zone: NgZone
  ) {
    addIcons({ trash, moon, sunny });
  }

  get allSleepData() {
    return SleepService.AllSleepData;
  }

  async confirmDelete(log: SleepData, slidingItem: IonItemSliding) {
    await slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: 'Delete this log?',
      message: log.dateString() + ': ' + log.summaryString(),
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => this.deleteWithUndo(log) }
      ]
    });
    await alert.present();
  }

  private async deleteWithUndo(log: SleepData) {
    await this.sleepService.deleteLog(log.id);
    const toast = await this.toastCtrl.create({
      message: 'Log deleted',
      duration: 4000,
      position: 'bottom',
      buttons: [
        {
          text: 'Undo',
          role: 'cancel',
          handler: async () => {
            await this.sleepService.restoreLog(log);
            this.zone.run(() => {});
          }
        }
      ]
    });
    await toast.present();
  }

  iconFor(log: SleepData): string {
    return log instanceof OvernightSleepData ? 'moon' : 'sunny';
  }

  colorFor(log: SleepData): string {
    return log instanceof OvernightSleepData ? 'primary' : 'secondary';
  }
}