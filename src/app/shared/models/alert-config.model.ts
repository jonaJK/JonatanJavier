export type AlertType = 'success' | 'danger' | 'warning';

export interface AlertConfig {
    type: AlertType;
    title: string;
    description: string;
}
