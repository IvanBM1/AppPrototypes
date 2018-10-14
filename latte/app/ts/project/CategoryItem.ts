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
        }

        //region Private Methods
        /**
         * return true if the string is in [A-Z, 0-9] only
         * @param {string} str
         * @returns {RegExpExecArray | null}
         */
        private evaluate(str: string) {
            let exp = /^(?!.*[\!\"\#\$\%\&\(\)\=\'\¿\¡\<\>\´\+\{\}\-\~\^\`\*\¨\:\;])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }

        //endregion

        //region Methods
        /**
         * click button delete category
         */
        btnDelCategory_click() {
            this.onClickBtnDelCategory();
        }

        /**
         * click button expand category
         */
        btnExpandCategory_click() {
            this.showExpand = !this.showExpand;
            this.onClickBtnExpand();
        }

        /**
         * click button share category
         */
        btnShareCategory_click() {
            Image.searchOne({
                idcategory: this.category.idcategory,
                trash: 'false',
                archived: 'false'
            },'name').send(prototype => {
                if (prototype)
                    this.modalCategory.shareModal(strings.shareHost + "guid=" + prototype.guid);
            });
        }

        /**
         * contact the category
         */
        contract() {
            this.btnExpandCategory.text = "expand_more";
            this.itemsPrototype.style.display = 'none';
            this.infoDragMessage.style.display = "none";
        }

        /**
         * expand the category
         */
        expand() {
            this.btnExpandCategory.text = "expand_less";
            this.itemsPrototype.style.display = "flex";
            this.infoDragMessage.style.display = "flex";
            this.loadPrototypes();
        }

        /**
         * load prototypes width associate, width end call function loadPrototypesNotAssociate
         */
        loadPrototypesAssociate() {
            Image.imageAssociate(this.category.idcategory, this.archived).send(prototypes => {
                if (prototypes != null) {
                    prototypes.forEach(prototype => {

                        let prototypeItem2 = new PrototypeItem2();

                        prototypeItem2.desktop = prototype[0];
                        prototypeItem2.mobile = prototype[1];

                        prototypeItem2.clickDesktop.add(() => {
                            this.prototypeSelected = prototypeItem2.desktop;
                        });
                        prototypeItem2.clickMobile.add(() => {
                            this.prototypeSelected = prototypeItem2.mobile
                        });

                        prototypeItem2.isCheckDeskChanged.add(() => {
                            prototypeItem2.isCheckDesk ? this.countChecked++ : this.countChecked--;
                        });

                        prototypeItem2.isCheckMobileChanged.add(() => {
                            prototypeItem2.isCheckMobile ? this.countChecked++ : this.countChecked--;
                        });

                        prototypeItem2.needRefresh.add(() => this.loadPrototypes());
                        prototypeItem2.dropIcon.add(() => {
                            this.dropPrototypes = false;
                        });
                        prototypeItem2.showLoader.add(() => this.loader.show());
                        prototypeItem2.hideLoader.add(() => this.loader.hidden());


                        prototypeItem2.refreshTheCategoryChanged.add(() => {
                            this.refreshTheCategory = prototypeItem2.refreshTheCategory;
                        });

                        prototypeItem2.tag = prototype;

                        this.itemsPrototype.add(prototypeItem2);
                    });
                    this.loadPrototypesNotAssociate();
                } else
                    this.loadPrototypesNotAssociate();
            });
        }

        /**
         * load prototypes width not associate
         */
        loadPrototypesNotAssociate() {
            Image.notAssociate(this.category.idcategory, this.archived).send(prototypes => {
                if (prototypes.length > 0) {
                    prototypes.forEach(prototype => {
                        let prototypeItem2 = new PrototypeItem2();

                        if (prototype.type == 1) {
                            prototypeItem2.desktop = prototype;
                            prototypeItem2.clickDesktop.add(() => this.prototypeSelected = prototype);
                        }
                        else if (prototype.type == 2) {
                            prototypeItem2.mobile = prototype;
                            prototypeItem2.clickMobile.add(() => this.prototypeSelected = prototype);
                        }

                        prototypeItem2.isCheckDeskChanged.add(() => {
                            prototypeItem2.isCheckDesk ? this.countChecked++ : this.countChecked--;
                        });

                        prototypeItem2.isCheckMobileChanged.add(() => {
                            prototypeItem2.isCheckMobile ? this.countChecked++ : this.countChecked--;
                        });

                        prototypeItem2.needRefresh.add(() => {
                            this.loadPrototypes();
                        });
                        prototypeItem2.dropIcon.add(() => {
                            this.dropPrototypes = false;
                        });
                        prototypeItem2.refreshTheCategoryChanged.add(() => {
                            this.refreshTheCategory = prototypeItem2.refreshTheCategory;
                        });

                        this.itemsPrototype.add(prototypeItem2);
                    });
                    this.loader.hidden();
                } else {
                    this.loader.hidden();
                }

                if (this.itemsPrototype.getCollection().length == 0)
                    this.itemsPrototype.add(this.itemsPrototypeMessage);

                this.itemsPrototype.add(this.btnAddImages);
                this.loadingView = false;
            });
        }

        /**
         * load all prototypes
         */
        loadPrototypes() {
            this.loader.show();

            this.loadingView = true;
            this.itemsPrototype.clear();

            if (this.typeImage == 3)
                this.loadPrototypesAssociate();

            if (this.typeImage == 1 || this.typeImage == 2) {
                Image.search({
                    idcategory: this.category.idcategory,
                    type: (this.typeImage > 2) ? null : this.typeImage,
                    archived: (this.archived) ? '1' : '0',
                    trash: '0'
                },'name ASC, created DESC').send(prototypes => {
                    if (prototypes.length > 0) {
                        prototypes.forEach(prototype => {
                            let prototypeItem = new PrototypeItem();
                            prototypeItem.prototype = prototype;
                            prototypeItem.click.add(() => {
                                this.prototypeSelected = prototype;
                            });
                            prototypeItem.checkedChanged.add(() => {
                                (prototypeItem.checked) ? this.countChecked++ : this.countChecked--;
                            });
                            prototypeItem.tag = prototype;
                            this.itemsPrototype.add(prototypeItem);
                        });

                        this.loader.hidden();
                    } else {
                        this.itemsPrototype.add(this.itemsPrototypeMessage);
                        this.loader.hidden();
                    }

                    this.itemsPrototype.add(this.btnAddImages);
                    this.loadingView = false;
                });
            }
        }

        /**
         * Raises the <c>category</c> event
         */
        onCategoryChanged() {
            if (this._categoryChanged) {
                this._categoryChanged.raise();
            }
            this.onLoad();
        }

        /**
         * Raises the <c>clickBtnDelCategory</c> event
         */
        onClickBtnDelCategory() {
            if (this._clickBtnDelCategory) {
                this._clickBtnDelCategory.raise();
            }
        }

        /**
         * Raises the <c>clickBtnExpand</c> event
         */
        onClickBtnExpand() {
            if (this._clickBtnExpand) {
                this._clickBtnExpand.raise();
            }
        }

        /**
         * Raises the <c>countChecked</c> event
         */
        onCountCheckedChanged() {
            if (this._countCheckedChanged) {
                this._countCheckedChanged.raise();
            }

            if (this.countChecked > 0)
                this.itemsChecked = true;
            else
                this.itemsChecked = false;
        }

        /**
         * Raises the <c>countUpdate</c> event
         */
        onCountUpdateChanged() {
            if (this._countUpdateChanged) {
                this._countUpdateChanged.raise();
            }

            if (this.countUpdate == 0) {
                this.loadPrototypes();
            }
        }

        /**
         * Raises the <c>itemsChecked</c> event
         */
        onItemsCheckedChanged() {
            if (this._itemsCheckedChanged) {
                this._itemsCheckedChanged.raise();
            }
        }

        /**
         * load components
         */
        onLoad() {
            LocalEditor.onClick(this.nameCategory.raw, () => {

                if (this.evaluate(this.nameCategory.text)) {
                    this.category.name = this.nameCategory.text;
                    this.category.save();
                } else {
                    this.nameCategory.text = this.category.name;
                }
            });

            this.itemsPrototypeMessage.text = strings.withoutElements;
            this.infoDragMessage.text = strings.dragimages;
            this.nameCategory.text = this.category.name;

            this.modal.add(this.modalCategory);
            this.cntLoader.add(this.loader);
            this.btnAddImages.removeFromParent();

            this.btnAddImages.addEventListener('change', ev => {
                this.uploadImages(ev.target.files);
            });

            this.itemsPrototype.addEventListener('dragover', ev => ev.preventDefault());
            this.itemsPrototype.addEventListener('dragenter', ev => {
                ev.target.style.opacity = "0.2";
            });
            this.itemsPrototype.addEventListener('dragleave', ev => {
                ev.target.style.opacity = "";
            });
            this.itemsPrototype.addEventListener('drop', ev => {
                ev.target.style.opacity = "";
                ev.preventDefault();

                if (this.dropPrototypes) {

                    let idimage = ev.dataTransfer.getData("prototype");

                    if (idimage != "") {

                        Image.searchOne({
                            idimage: idimage,
                            trash: 'false'
                        },'name').send(prototype => {
                            let theCategory = prototype.idcategory;
                            prototype.idcategory = this.category.idcategory;

                            if (prototype.idassociate != 0) {

                                Image.searchOne({
                                    idimage: prototype.idassociate,
                                    trash: 'false'
                                },'name').send(associate => {
                                    associate.idassociate = 0;
                                    associate.save(() => {
                                        if (associate.idcategory != this.category.idcategory)
                                            this.refreshTheCategory = associate.idcategory;
                                    });
                                });
                            }

                            prototype.idassociate = 0;
                            prototype.archived = this.archived;

                            prototype.save(() => {
                                this.loadPrototypes();

                                if (theCategory != this.category.idcategory)
                                    this.refreshTheCategory = theCategory;
                            });
                        });
                    } else {
                        let filesSend = [];
                        let dt = ev.dataTransfer;
                        if (dt.items[0].kind == "file") {
                            for (let i = 0; i < dt.items.length; i++) {
                                if (dt.items[i].kind == "file") {
                                    let imageFile = dt.items[i].getAsFile();
                                    filesSend.push(imageFile);
                                }
                            }
                            this.uploadImages(filesSend);
                        }
                    }
                } else {
                    this.dropPrototypes = true;
                }

            });

            this.headCategory.addEventListener('dragenter', ev => {
                this.showExpand = true;
            });
        }

        /**
         * Raises the <c>loadingView</c> event
         */
        onLoadingViewChanged() {
            if (this._loadingViewChanged) {
                this._loadingViewChanged.raise();
            }
            this.countChecked = 0;
        }

        /**
         * Raises the <c>prototypeSelected</c> event
         */
        onPrototypeSelectedChanged() {
            if (this._prototypeSelectedChanged) {
                this._prototypeSelectedChanged.raise();
            }
        }

        /**
         * Raises the <c>refreshTheCategory</c> event
         */
        onRefreshTheCategoryChanged() {
            if (this._refreshTheCategoryChanged) {
                if (this._refreshTheCategoryChanged != null)
                    this._refreshTheCategoryChanged.raise();
            }
        }

        /**
         * Raises the <c>showExpand</c> event
         */
        onShowExpandChanged() {
            if (this._showExpandChanged) {
                this._showExpandChanged.raise();
            }

            if (this.showExpand)
                this.expand();
            else
                this.contract();
        }

        /**
         * Raises the <c>typeImage</c> event
         */
        onTypeImageChanged() {
            if (this._typeImageChanged) {
                this._typeImageChanged.raise();
            }
        }

        /**
         * Raises the <c>uploadImageCount</c> event
         */
        onUploadImageCountChanged() {
            if (this._uploadImageCountChanged) {
                this._uploadImageCountChanged.raise();
            }

            if (this.uploadImageCount == 0) {
                this.loadPrototypes();
            }
        }

        /**
         * upload images
         * @param files
         */
        uploadImages(files) {

            if (files.length > 0)
                this.loadingView = true;

            this.uploadImageCount = files.length;

            for (let i = 0; i < files.length; i++) {

                let imageFile = files[i];
                let newImage = new Image();
                newImage.idcategory = this.category.idcategory;
                newImage.name = strings.newImage;
                newImage.type = (this.typeImage == 3) ? 1 : this.typeImage;
                newImage.description = strings.descriptionDefault;
                newImage.archived = this.archived;

                newImage.save(() => {

                    Image.searchOne({
                        idimage: newImage.idimage,
                        trash: 'false'
                    },'name').send(image => {
                        let formData = new FormData();
                        formData.append('file', imageFile);
                        formData.append('guid', image.guid);

                        let xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState == 4) {
                                this.uploadImageCount--;
                            }
                        };

                        xhr.open('post', 'uploadImage.php', true);
                        xhr.send(formData);
                    });
                });
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
        get categoryChanged(): LatteEvent {
            if (!this._categoryChanged) {
                this._categoryChanged = new LatteEvent(this);
            }
            return this._categoryChanged;
        }

        /**
         * Back field for event
         */
        private _clickBtnDelCategory: LatteEvent;

        /**
         * Gets an event raised when click button delete category
         *
         * @returns {LatteEvent}
         */
        get clickBtnDelCategory(): LatteEvent {
            if (!this._clickBtnDelCategory) {
                this._clickBtnDelCategory = new LatteEvent(this);
            }
            return this._clickBtnDelCategory;
        }

        /**
         * Back field for event
         */
        private _clickBtnExpand: LatteEvent;

        /**
         * Gets an event raised when click button expand category
         *
         * @returns {LatteEvent}
         */
        get clickBtnExpand(): LatteEvent {
            if (!this._clickBtnExpand) {
                this._clickBtnExpand = new LatteEvent(this);
            }
            return this._clickBtnExpand;
        }

        /**
         * Back field for event
         */
        private _countCheckedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the countChecked property changes
         *
         * @returns {LatteEvent}
         */
        get countCheckedChanged(): LatteEvent {
            if (!this._countCheckedChanged) {
                this._countCheckedChanged = new LatteEvent(this);
            }
            return this._countCheckedChanged;
        }

        /**
         * Back field for event
         */
        private _countUpdateChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the countUpdate property changes
         *
         * @returns {LatteEvent}
         */
        get countUpdateChanged(): LatteEvent {
            if (!this._countUpdateChanged) {
                this._countUpdateChanged = new LatteEvent(this);
            }
            return this._countUpdateChanged;
        }

        /**
         * Back field for event
         */
        private _itemsCheckedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the itemsChecked property changes
         *
         * @returns {LatteEvent}
         */
        get itemsCheckedChanged(): LatteEvent {
            if (!this._itemsCheckedChanged) {
                this._itemsCheckedChanged = new LatteEvent(this);
            }
            return this._itemsCheckedChanged;
        }

        /**
         * Back field for event
         */
        private _loadingViewChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the loadingView property changes
         *
         * @returns {LatteEvent}
         */
        get loadingViewChanged(): LatteEvent {
            if (!this._loadingViewChanged) {
                this._loadingViewChanged = new LatteEvent(this);
            }
            return this._loadingViewChanged;
        }

        /**
         * Back field for event
         */
        private _prototypeSelectedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the prototypeSelected property changes
         *
         * @returns {LatteEvent}
         */
        get prototypeSelectedChanged(): LatteEvent {
            if (!this._prototypeSelectedChanged) {
                this._prototypeSelectedChanged = new LatteEvent(this);
            }
            return this._prototypeSelectedChanged;
        }

        /**
         * Back field for event
         */
        private _refreshTheCategoryChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the refreshTheCategory property changes
         *
         * @returns {LatteEvent}
         */
        get refreshTheCategoryChanged(): LatteEvent {
            if (!this._refreshTheCategoryChanged) {
                this._refreshTheCategoryChanged = new LatteEvent(this);
            }
            return this._refreshTheCategoryChanged;
        }

        /**
         * Back field for event
         */
        private _showExpandChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the showExpand property changes
         *
         * @returns {LatteEvent}
         */
        get showExpandChanged(): LatteEvent {
            if (!this._showExpandChanged) {
                this._showExpandChanged = new LatteEvent(this);
            }
            return this._showExpandChanged;
        }

        /**
         * Back field for event
         */
        private _typeImageChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the typeImage property changes
         *
         * @returns {LatteEvent}
         */
        get typeImageChanged(): LatteEvent {
            if (!this._typeImageChanged) {
                this._typeImageChanged = new LatteEvent(this);
            }
            return this._typeImageChanged;
        }

        /**
         * Back field for event
         */
        private _uploadImageCountChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the uploadImageCount property changes
         *
         * @returns {LatteEvent}
         */
        get uploadImageCountChanged(): LatteEvent {
            if (!this._uploadImageCountChanged) {
                this._uploadImageCountChanged = new LatteEvent(this);
            }
            return this._uploadImageCountChanged;
        }

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _archived: boolean = false;

        /**
         * Gets or sets if need show prototypes archived
         *
         * @returns {boolean}
         */
        get archived(): boolean {
            return this._archived;
        }

        /**
         * Gets or sets if need show prototypes archived
         *
         * @param {boolean} value
         */
        set archived(value: boolean) {
            this._archived = value;
        }

        /**
         * Property field
         */
        private _category: Category = null;

        /**
         * Gets or sets category
         *
         * @returns {Category}
         */
        get category(): Category {
            return this._category;
        }

        /**
         * Gets or sets category
         *
         * @param {Category} value
         */
        set category(value: Category) {

            // Check if value changed
            let changed: boolean = value !== this._category;

            // Set value
            this._category = value;

            // Trigger changed event
            if (changed) {
                this.onCategoryChanged();
            }
        }

        /**
         * Property field
         */
        private _countChecked: number = 0;

        /**
         * Gets or sets one checkbox is checked
         *
         * @returns {number}
         */
        get countChecked(): number {
            return this._countChecked;
        }

        /**
         * Gets or sets one checkbox is checked
         *
         * @param {number} value
         */
        set countChecked(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._countChecked;

            // Set value
            this._countChecked = value;

            // Trigger changed event
            if (changed) {
                this.onCountCheckedChanged();
            }
        }

        /**
         * Property field
         */
        private _countUpdate: number = 0;

        /**
         * Gets or sets counter to update elements in database
         *
         * @returns {number}
         */
        get countUpdate(): number {
            return this._countUpdate;
        }

        /**
         * Gets or sets counter to update elements in database
         *
         * @param {number} value
         */
        set countUpdate(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._countUpdate;

            // Set value
            this._countUpdate = value;

            // Trigger changed event
            if (changed) {
                this.onCountUpdateChanged();
            }
        }

        /**
         * Property field
         */
        private _dropPrototypes: boolean = true;

        /**
         * Gets or sets drop in prototypes
         *
         * @returns {boolean}
         */
        get dropPrototypes(): boolean {
            return this._dropPrototypes;
        }

        /**
         * Gets or sets drop in prototypes
         *
         * @param {boolean} value
         */
        set dropPrototypes(value: boolean) {
            this._dropPrototypes = value;
        }

        /**
         * Property field
         */
        private _loadingView: boolean = false;

        /**
         * Gets or sets status load view
         *
         * @returns {boolean}
         */
        get loadingView(): boolean {
            return this._loadingView;
        }

        /**
         * Gets or sets status load view
         *
         * @param {boolean} value
         */
        set loadingView(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._loadingView;

            // Set value
            this._loadingView = value;

            // Trigger changed event
            if (changed) {
                this.onLoadingViewChanged();
            }
        }

        /**
         * Property field
         */
        private _prototypeSelected: Image = null;

        /**
         * Gets or sets image
         *
         * @returns {Image}
         */
        get prototypeSelected(): Image {
            return this._prototypeSelected;
        }

        /**
         * Gets or sets image
         *
         * @param {Image} value
         */
        set prototypeSelected(value: Image) {

            // Check if value changed
            let changed: boolean = value !== this._prototypeSelected;

            // Set value
            this._prototypeSelected = value;

            // Trigger changed event
            if (changed) {
                this.onPrototypeSelectedChanged();
            }
        }

        /**
         * Property field
         */
        private _refreshTheCategory: number = null;

        /**
         * Gets or sets need refresh one category extern
         *
         * @returns {number}
         */
        get refreshTheCategory(): number {
            return this._refreshTheCategory;
        }

        /**
         * Gets or sets need refresh one category extern
         *
         * @param {number} value
         */
        set refreshTheCategory(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._refreshTheCategory;

            // Set value
            this._refreshTheCategory = value;

            // Trigger changed event
            if (changed) {
                this.onRefreshTheCategoryChanged();
            }
        }

        /**
         * Property field
         */
        private _showExpand: boolean = false;

        /**
         * Gets or sets need category expand
         *
         * @returns {boolean}
         */
        get showExpand(): boolean {
            return this._showExpand;
        }

        /**
         * Gets or sets need category expand
         *
         * @param {boolean} value
         */
        set showExpand(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._showExpand;

            // Set value
            this._showExpand = value;

            // Trigger changed event
            if (changed) {
                this.onShowExpandChanged();
            }
        }

        /**
         * Property field
         */
        private _typeImage: number = null;

        /**
         * Gets or sets type of image
         *
         * @returns {number}
         */
        get typeImage(): number {
            return this._typeImage;
        }

        /**
         * Gets or sets type of image
         *
         * @param {number} value
         */
        set typeImage(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._typeImage;

            // Set value
            this._typeImage = value;

            // Trigger changed event
            if (changed) {
                this.onTypeImageChanged();
            }
        }

        /**
         * Property field
         */
        private _uploadImageCount: number = null;

        /**
         * Gets or sets upload image
         *
         * @returns {number}
         */
        get uploadImageCount(): number {
            return this._uploadImageCount;
        }

        /**
         * Gets or sets upload image
         *
         * @param {number} value
         */
        set uploadImageCount(value: number) {

            // Check if value changed
            let changed: boolean = value !== this._uploadImageCount;

            // Set value
            this._uploadImageCount = value;

            // Trigger changed event
            if (changed) {
                this.onUploadImageCountChanged();
            }
        }

        /**
         * Property field
         */
        private _itemsChecked: boolean = false;

        /**
         * Gets or sets at least one item is checked
         *
         * @returns {boolean}
         */
        get itemsChecked(): boolean {
            return this._itemsChecked;
        }

        /**
         * Gets or sets at least one item is checked
         *
         * @param {boolean} value
         */
        set itemsChecked(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._itemsChecked;

            // Set value
            this._itemsChecked = value;

            // Trigger changed event
            if (changed) {
                this.onItemsCheckedChanged();
            }
        }

        //endregion

        //region Components
        /**
         * Field for modalCategory property
         */
        private _modalCategory: Modal;

        /**
         * Gets modal of category
         *
         * @returns {Modal}
         */
        get modalCategory(): Modal {
            if (!this._modalCategory) {
                this._modalCategory = new Modal();
            }
            return this._modalCategory;
        }

        /**
         * Field for loader property
         */
        private _loader: LoaderItem;

        /**
         * Gets loader
         *
         * @returns {LoaderItem}
         */
        get loader(): LoaderItem {
            if (!this._loader) {
                this._loader = new LoaderItem();
            }
            return this._loader;
        }

        //endregion
    }

}