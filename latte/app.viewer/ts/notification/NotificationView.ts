module latte {

    /**
     *
     */
    export class NotificationView extends NotificationViewBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
            this.onLoad();
        }

        //region Private Methods
        /**
         * chang view of notification list
         */
        private changeView() {
            if (this.notificationsList.style.display == "flex") {
                this.notificationsList.style.display = "none";
            } else {
                this.loadNotifications();
                this.notificationsList.style.display = "flex";
            }
        }

        /**
         * show button notification active [style]
         */
        private notificationActive(value: number) {
            this.counter.text = value.toString();
            this.counter.style.display = "flex";
        }

        /**
         * show button notification not active
         */
        private notificationNone() {
            this.counter.style.display = "none";
        }

        /**
         * swap style of button notification if exist notification
         */
        private checkNotifications() {
            Notification.checkNotificationsByProject(this.idproject).send(response => {
                if (response > 0)
                    this.notificationActive(response);
                else
                    this.notificationNone();
            });
        }

        //endregion

        //region Methods
        /**
         * load notifications
         */
        loadNotifications() {
            Notification.notificationsByProject(this.idproject).send(notifications => {
                console.log(notifications);
                this.notificationsList.clear();
                if( notifications.length > 0 ){
                    notifications.forEach(notification => {
                        let notificationItem = new NotificationItem();
                        notificationItem.notification = notification;
                        notificationItem.click.add(() => {
                            this.notificationSelected = notificationItem.notification;
                        });
                        this.notificationsList.add(notificationItem);
                    });
                }
            });
        }

        /**
         * load components
         */
        onLoad() {
            this.notificationsList.style.display = "none";

            window.addEventListener('click', ev => {
                if (ev.target == this.btnNotification.raw) {
                    this.changeView();
                }
                else {
                    this.notificationsList.style.display = "none";
                }
            });

            window.setInterval(() => this.checkNotifications(), 1000);

        }

        /**
         * Raises the <c>notificationSelected</c> event
         */
        onNotificationSelectedChanged() {
            if (this._notificationSelectedChanged) {
                this._notificationSelectedChanged.raise();
            }
        }
        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _notificationSelectedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the notificationSelected property changes
         *
         * @returns {LatteEvent}
         */
        get notificationSelectedChanged(): LatteEvent {
            if (!this._notificationSelectedChanged) {
                this._notificationSelectedChanged = new LatteEvent(this);
            }
            return this._notificationSelectedChanged;
        }

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _notificationSelected: Notification = null;

        /**
         * Gets or sets selected notification
         *
         * @returns {Notification}
         */
        get notificationSelected(): Notification {
            return this._notificationSelected;
        }

        /**
         * Gets or sets selected notification
         *
         * @param {Notification} value
         */
        set notificationSelected(value: Notification) {

            // Check if value changed
            let changed: boolean = value !== this._notificationSelected;

            // Set value
            this._notificationSelected = value;

            // Trigger changed event
            if (changed) {
                this.onNotificationSelectedChanged();
            }
        }

        /**
         * Property field
         */
        private _idproject: number = null;

        /**
         * Gets or sets idproject
         *
         * @returns {number}
         */
        get idproject(): number {
            return this._idproject;
        }

        /**
         * Gets or sets idproject
         *
         * @param {number} value
         */
        set idproject(value: number) {
            this._idproject = value;
        }
        //endregion
    }

}