module latte {

    /**
     *
     */
    export class HistoryItem extends HistoryItemBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
            this.addEventListener('click', () => this.onClick());
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
         * Raises the <c>history</c> event
         */
        onHistoryChanged() {
            if (this._historyChanged) {
                this._historyChanged.raise();
            }
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _historyChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the history property changes
         *
         * @returns {LatteEvent}
         */
        get historyChanged(): LatteEvent {
            if (!this._historyChanged) {
                this._historyChanged = new LatteEvent(this);
            }
            return this._historyChanged;
        }

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

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _history: History = null;

        /**
         * Gets or sets history
         *
         * @returns {History}
         */
        get history(): History {
            return this._history;
        }

        /**
         * Gets or sets history
         *
         * @param {History} value
         */
        set history(value: History) {

            // Check if value changed
            let changed: boolean = value !== this._history;

            // Set value
            this._history = value;

            // Trigger changed event
            if (changed) {
                this.onHistoryChanged();
            }
        }

        //endregion

    }

}