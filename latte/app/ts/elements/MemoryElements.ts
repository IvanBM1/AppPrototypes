module latte {

    export class MemoryElement extends Element<HTMLElement> {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         * Create memory element instance.
         *
         * @param tagName
         */
        constructor(tagName: string = 'div') {
            super(document.createElement(tagName));
        }

        //region Private Methods
        //endregion

        //region Methods
        //endregion

        //region Events
        //endregion

        //region Properties
        //endregion

    }

}