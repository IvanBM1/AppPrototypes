module latte {

    /**
     *
     */
    export class FilterStatusView extends FilterStatusViewBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         * constructor
         */
        constructor() {
            super();
        }

        //region Private Methods
        //endregion

        //region Methods
        /**
         * add button to view
         */
        addButton(name: string = "", icon: string = "") {

            let button = new FilterStatusItem();

            button.icon.text = icon;
            button.str.text = name;
            button.idbutton = this.buttons.length + 1;
            button.click.add(() => {
                this.status = button.idbutton;
            });

            if (this.buttons.length == 0) {
                button.addClass('left');
                button.addClass('active');
            } else
                button.addClass('right');

            this.buttons.push(button);

            if (this.buttons.length >= 3) {
                this.buttons[this.buttons.length - 2].removeClass('right');
                this.buttons[this.buttons.length - 2].addClass('center');
            }

            this.items.add(button);
        }

        /**
         * Raises the <c>status</c> event
         */
        onStatusChanged() {
            if (this._statusChanged) {
                this._statusChanged.raise();
            }

            this.buttons.forEach(button => {
                if (button.idbutton != this.status)
                    button.removeClass('active');
            });
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _statusChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the status property changes
         *
         * @returns {LatteEvent}
         */
        get statusChanged(): LatteEvent {
            if (!this._statusChanged) {
                this._statusChanged = new LatteEvent(this);
            }
            return this._statusChanged;
        }

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _buttons: FilterStatusItem[] = [];

        /**
         * Gets or sets buttons
         *
         * @returns {FilterStatusItem[]}
         */
        get buttons(): FilterStatusItem[] {
            return this._buttons;
        }

        /**
         * Gets or sets buttons
         *
         * @param {FilterStatusItem[]} value
         */
        set buttons(value: FilterStatusItem[]) {
            this._buttons = value;
        }

        /**
         * Property field
         */
        private _status: number = 1;

        /**
         * Gets or sets status
         *
         * @returns {number}
         */
        get status(): number {
            return this._status;
        }

        /**
         * Gets or sets status
         *
         * @param {number} value
         */
        set status(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._status;

            // Set value
            this._status = value;

            // Trigger changed event
            if (changed) {
                this.onStatusChanged();
            }
        }

        //endregion


    }

}