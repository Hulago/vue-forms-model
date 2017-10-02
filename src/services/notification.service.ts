import * as iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

interface INotificationSettings {
  timeout?: number;
  resetOnHover?: boolean;
  icon?: string;
  transitionIn?: string;
  transitionOut?: string;
}

export class NotificationService {
  private static _instance: NotificationService;

  public timeout: number;
  public resetOnHover: boolean;
  public icon: string;
  public transitionIn: string;
  public transitionOut: string;

  private constructor(options: INotificationSettings = {}) {
    (this.timeout = options.timeout || 2000),
      (this.resetOnHover = options.resetOnHover ? true : false),
      (this.icon = options.icon || 'material-icons'),
      (this.transitionIn = options.transitionIn || 'flipInX'),
      (this.transitionOut = options.transitionOut || 'flipOutX');
  }

  static createInstance() {
    NotificationService.getInstance();
  }

  static getInstance() {
    return this._instance || (this._instance = new this());
  }

  info(title: string, message: string, icon: string = 'info') {
    this.notify('info', title, message, icon);
  }

  success(title: string, message: string, icon: string = 'check') {
    this.notify('success', title, message, icon);
  }

  warning(title: string, message: string, icon: string = 'warning') {
    this.notify('warning', title, message, icon);
  }

  error(title: string, message: string, icon: string = 'error') {
    this.notify('error', title, message, icon);
  }

  notify(type: string, title: string, message: string, icon: string) {
    iziToast[type]({
      title,
      message,
      iconText: icon,
      timeout: this.timeout,
      resetOnHover: this.resetOnHover,
      icon: this.icon,
      transitionIn: this.transitionIn,
      transitionOut: this.transitionOut,
    });
  }
}
