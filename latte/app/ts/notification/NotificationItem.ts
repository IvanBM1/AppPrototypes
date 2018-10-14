module latte {

    /**
     *
     */
    export class NotificationItem extends NotificationItemBase {

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
        //endregion

        //region Methods
        /**
         * Raises the <c>click</c> event
         */
        onClick() {
            if (this._click) {
                this._click.raise();
            }
        }

        /**
         * Raises the <c>notification</c> event
         */
        onNotificationChanged() {
            if (this._notificationChanged) {
                this._notificationChanged.raise();
            }

            if(this.notification != null){
                this.project.text = this.notification.project;
                this.affair.text = this.notification.affair;
                this.prototype.text = this.notification.prototype.name;
                this.status.text = (this.notification.viewed) ? "check_box" : "check_box_outline_blank";
            }
        }

        /**
         * load components
         */
        onLoad() {
            this.addEventListener('click', ev => this.onClick());
        }

        //endregion

        //region Events

        /**
         * Back field for event
         */
        private _click: LatteEvent;

        /**
         * Gets an event raised when click
         *
         * @returns {LatteEvent}
         */
        get click(): LatteEvent {
            if (!this._click) {
                this._click = new LatteEvent(this);
            }
            return this._click;
        }

        /**
         * Back field for event
         */
        private _notificationChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the notification property changes
         *
         * @returns {LatteEvent}
         */
        get notificationChanged(): LatteEvent {
            if (!this._notificationChanged) {
                this._notificationChanged = new LatteEvent(this);
            }
            return this._notificationChanged;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _notification: Notification = null;

        /**
         * Gets or sets when what?
         *
         * @returns {Notification}
         */
        get notification(): Notification {
            return this._notification;
        }

        /**
         * Gets or sets when what?
         *
         * @param {Notification} value
         */
        set notification(value: Notification) {

            // Check if value changed
            let changed: boolean = value !== this._notification;

            // Set value
            this._notification = value;

            // Trigger changed event
            if (changed) {
                this.onNotificationChanged();
            }
        }
        //endregion

    }

}