module latte {

    /**
     *
     */
    export class CategoryItem extends CategoryItemBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
            this.addEventListener('click', () => this.onClick() );
        }

        //region Private Methods
        //endregion

        //region Methods
        /**
         * Raises the <c>category</c> event
         */
        onCategoryChanged() {
            if (this._categoryChanged) {
                this._categoryChanged.raise();
            }
            this.text = this.category.name;
            this.raw.id = this.category.idcategory.toString();
        }

        /**
         * Raises the <c>click</c> event
         */
        onClick(){
            if(this._click){
                this._click.raise();
            }
        }
        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _categoryChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the category property changes
         *
         * @returns {LatteEvent}
         */
        get categoryChanged(): LatteEvent{
            if(!this._categoryChanged){
                this._categoryChanged = new LatteEvent(this);
            }
            return this._categoryChanged;
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
        get click(): LatteEvent{
            if(!this._click){
                this._click = new LatteEvent(this);
            }
            return this._click;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _category: Category = null;

        /**
         * Gets or sets category
         *
         * @returns {Category}
         */
        get category(): Category{
            return this._category;
        }

        /**
         * Gets or sets category
         *
         * @param {Category} value
         */
        set category(value: Category){

            // Check if value changed
            let changed: boolean = value !== this._category;

            // Set value
            this._category = value;

            // Trigger changed event
            if(changed){
                this.onCategoryChanged();
            }
        }
        //endregion

    }

}