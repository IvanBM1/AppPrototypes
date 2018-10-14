module latte {

    /**
     *
     */
    export class SelectCategory extends SelectCategoryBase {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
            this.select.addEventListener('change', () =>  {
                this.selectedCategory = parseInt(this.select.raw.value);
            });
        }

        //region Private Methods
        setCategory( value ){
            this.idcategory = value;
        }
        //endregion

        //region Methods

        /**
         * load categories options in select
         */
        loadCategories(){

            this.select.clear();

            Category.categoriesInProject(this.idcategory).send( categories => {
                if( categories.length > 0 ){
                    categories.forEach( category => {
                        let option = document.createElement("option");
                        option.text = category.name;
                        option.value = category.idcategory.toString();
                        this.select.raw.add( option );

                        if( this.idcategory == category.idcategory ){
                            this.select.raw.selectedIndex = this.select.raw.length-1;
                        }

                    });
                }
            });
        }

        /**
         * Raises the <c>idcategory</c> event
         */
        onIdcategoryChanged(){
            if(this._idcategoryChanged){
                this._idcategoryChanged.raise();
            }
            this.loadCategories();
        }

        /**
         * Raises the <c>selectedCategory</c> event
         */
        onSelectedCategoryChanged(){
            if(this._selectedCategoryChanged){
                this._selectedCategoryChanged.raise();
            }
        }
        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _idcategoryChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the idcategory property changes
         *
         * @returns {LatteEvent}
         */
        get idcategoryChanged(): LatteEvent{
            if(!this._idcategoryChanged){
                this._idcategoryChanged = new LatteEvent(this);
            }
            return this._idcategoryChanged;
        }

        /**
         * Back field for event
         */
        private _selectedCategoryChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the selectedCategory property changes
         *
         * @returns {LatteEvent}
         */
        get selectedCategoryChanged(): LatteEvent{
            if(!this._selectedCategoryChanged){
                this._selectedCategoryChanged = new LatteEvent(this);
            }
            return this._selectedCategoryChanged;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _idcategory: number = 0;

        /**
         * Gets or sets id category
         *
         * @returns {number}
         */
        get idcategory(): number{
            return this._idcategory;
        }

        /**
         * Gets or sets id category
         *
         * @param {number} value
         */
        set idcategory(value: number){

            // Check if value changed
            let changed: boolean = value !== this._idcategory;

            // Set value
            this._idcategory = value;

            // Trigger changed event
            if(changed){
                this.onIdcategoryChanged();
            }
        }

        /**
         * Property field
         */
        private _selectedCategory: number = null;

        /**
         * Gets or sets selected category
         *
         * @returns {number}
         */
        get selectedCategory(): number{
            return this._selectedCategory;
        }

        /**
         * Gets or sets selected category
         *
         * @param {number} value
         */
        set selectedCategory(value: number){

            // Check if value changed
            let changed: boolean = value !== this._selectedCategory;

            // Set value
            this._selectedCategory = value;

            // Trigger changed event
            if(changed){
                this.onSelectedCategoryChanged();
            }
        }
        //endregion
    }

}