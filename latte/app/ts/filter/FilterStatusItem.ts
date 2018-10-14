module latte {

    /**
     *
     */
    export class FilterStatusItem extends FilterStatusItemBase {

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
         * on load
         */
        onLoad() {
            this.addEventListener('click', () => this.onClick());
        }

        /**
         * Raises the <c>click</c> event
         */
        onClick() {
            if (this._click) {
                this._click.raise();
            }
            this.addClass('active');
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

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _idbutton: number = null;

        /**
         * Gets or sets idbutton
         *
         * @returns {number}
         */
        get idbutton(): number {
            return this._idbutton;
        }

        /**
         * Gets or sets idbutton
         *
         * @param {number} value
         */
        set idbutton(value: number) {
            this._idbutton = value;
        }

        //endregion

    }

}