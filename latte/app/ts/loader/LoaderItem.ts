module latte {

    /**
     *
     */
    export class LoaderItem extends LoaderItemBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
        }

        //region Private Methods
        //endregion

        //region Methods
        /**
         * show loader
         */
        show() {
            this.style.display = "flex";
        }

        /**
         * hide loader
         */
        hidden() {
            this.style.display = "none";
        }

        //endregion

        //region Events
        //endregion

        //region Properties
        //endregion

    }

}