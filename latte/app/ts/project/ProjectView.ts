module latte {


    /**
     *
     */
    export class ProjectView extends ProjectViewBase {

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
         * return true if the string is in [A-Z, 0-9] only
         * @param {string} str
         * @returns {RegExpExecArray | null}
         */
        private evaluate(str: string) {
            let exp = /^(?!.*[\!\"\#\$\%\&\(\)\=\'\¿\¡\<\>\´\+\{\}\-\~\^\`\*\¨\:\;])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }

        /**
         * swap style display of element
         * @param {latte.Element<HTMLElement>} element
         * @param {string} display
         */
        private changeView(element: Element<HTMLElement>, display: string) {
            if (element.style.display == display)
                element.style.display = "none";
            else
                element.style.display = display;
        }
        //endregion

        //region Methods
        /**
         * archive this project
         */
        btnArchive_click() {
            if (this.project.archived) {
                this.modal.unarchiveModal(this.project.name, () => {
                    this.project.archived = false;
                    this.project.save(() => {
                        this.onRemoveProject();
                    });
                });
            } else {
                this.modal.archivedModal(this.project.name, () => {
                    this.project.archived = true;
                    this.project.save(() => {
                        this.onRemoveProject();
                    });
                });
            }
        }

        /**
         * archive this project
         */
        btnArchiveMobile_click(){
            this.btnArchive_click();
        }

        /**
         *  button add new category
         */
        btnAddCategory_click() {
            if (this.evaluate(this.inpCategoryText.value)) {
                let category = new Category();
                category.idproject = this.project.idproject;
                category.name = this.inpCategoryText.value;
                category.save(() => {
                    this.lastCategoryOpen = category.recordId;
                    this.loadCategory();
                    this.inpCategoryText.text = "";
                });
            } else {
                this.inpCategoryText.style.outlineStyle = "auto";
                this.inpCategoryText.style.outlineColor = "var(--accent-color)";
            }
        }

        /**
         * close session of user
         */
        btnCloseSession_click() {
            this.onClickBtnCloseSession();
        }

        /**
         * close session of user
         */
        btnSessionMobile_click(){
            this.btnCloseSession_click();
        }

        /**
         * delete this project.
         */
        btnDelete_click() {
            this.modal.deleteModal(this.project.name, () => {
                this.project.trash = true;
                this.project.save(() => {
                    this.onRemoveProject();
                });
            });
        }

        /**
         * delete this project
         */
        btnDeleteMobile_click(){
            this.btnDelete_click();
        }

        /**
         * button delete items selected of categories
         */
        btnDeleteSelected_click() {
            this.modal.deleteModal(strings.elementsSelected, () => {
                this.loader.show();
                let toRemove = this.getSelected();
                Image.removeGroup(toRemove).send(response => this.loadCategory());
            });
        }

        /**
         * button archive items selected of categories
         */
        btnArchiveSelected_click() {
            if (this.filterState.status == 2) {
                this.modal.unarchiveModal(strings.elementsSelected, () => {
                    this.loader.show();
                    let toUnarchive = this.getSelected();
                    Image.unarchiveGroup(toUnarchive).send(response => this.loadCategory());
                });
            } else {
                this.modal.archivedModal(strings.elementsSelected, () => {
                    this.loader.show();
                    let toArchive = this.getSelected();
                    Image.archiveGroup(toArchive).send(response => this.loadCategory());
                });
            }
        }

        /**
         * click button return
         */
        btnReturn_click() {
            this.onClickBtnReturn();
        }

        /**
         * share project: get url to share
         */
        btnShare_click() {
            this.loader.show();

            Category.searchOne({
                idproject: this.project.idproject,
                trash: 'false'
            }).send(category => {
                if (category) {
                    Image.searchOne({
                        idcategory: category.idcategory,
                        trash: 'false',
                        archived: 'false'
                    },'name').send(image => {
                        if (image)
                            this.modal.shareModal(strings.shareHost + "guid=" + image.guid);
                        this.loader.hidden();
                    });
                } else {
                    this.loader.hidden();
                }
            });

        }

        /**
         * share project: get url to share-
         */
        btnShareMobile_click(){
            this.btnShare_click();
        }

        /**
         * get all items checked in the project. relative of catgory item.
         * @returns {any[]}
         */
        getSelected() {
            let itemsCategory = this.itemsCategory.getCollection();
            let itemsSelected = [];

            for (let i = 0; i < itemsCategory.length; i++) {

                if (itemsCategory[i] instanceof CategoryItem) {
                    let itemsPrototype = itemsCategory[i].itemsPrototype.getCollection();

                    for (let j = 0; j < itemsPrototype.length; j++) {

                        if (itemsPrototype[j] instanceof PrototypeItem) {
                            if (itemsPrototype[j].checked)
                                itemsSelected.push(itemsPrototype[j].prototype.idimage);
                        }

                        if (itemsPrototype[j] instanceof PrototypeItem2) {
                            if (itemsPrototype[j].isCheckDesk)
                                itemsSelected.push(itemsPrototype[j].desktop.idimage);
                            if (itemsPrototype[j].isCheckMobile)
                                itemsSelected.push(itemsPrototype[j].mobile.idimage);
                        }
                    }
                }
            }

            return itemsSelected;
        }

        /**
         * load all categories
         */
        loadCategory() {
            this.itemsCategory.clear();
            this.loader.show();
            this.countChecked = 0;

            let archived = (this.filterState.status == 2) ? true : false;

            Category.search({
                idproject: this.project.idproject
            }).send(categories => {
                if (!!categories.length) {
                    let countCategory = 0;
                    categories.forEach(category => {

                        let categoryItem = new CategoryItem();
                        categoryItem.archived = archived;
                        categoryItem.typeImage = this.filterDevice.status;
                        categoryItem.category = category;

                        categoryItem.prototypeSelectedChanged.add(() => {
                            if (categoryItem.prototypeSelected != null) {
                                this.prototypeSelected = categoryItem.prototypeSelected;
                                categoryItem.prototypeSelected = null;
                            }
                        });
                        categoryItem.clickBtnDelCategory.add(() => {
                            this.modal.deleteModal(category.name, () => {
                                categoryItem.category.trash = true;
                                categoryItem.category.save(() => {
                                    this.loadCategory();
                                });
                            });
                        });
                        categoryItem.clickBtnExpand.add(() => {
                            this.lastCategoryOpen = category.idcategory;
                        });
                        categoryItem.itemsCheckedChanged.add(() => {
                            if (categoryItem.itemsChecked)
                                this.countChecked++;
                            else
                                this.countChecked--;
                        });
                        categoryItem.refreshTheCategoryChanged.add(() => {
                            let collection = this.itemsCategory.getCollection();
                            for (let i = 0; i < collection.length; i++) {
                                if (collection[i]._category.idcategory == categoryItem.refreshTheCategory) {
                                    collection[i].loadPrototypes();
                                    categoryItem.refreshTheCategory = null;
                                    return;
                                }
                            }
                        });
                        categoryItem.loadingViewChanged.add(() => {
                            if (categoryItem.loadingView)
                                this.loader.show();
                            else
                                this.loader.hidden();
                        });

                        if (this.lastCategoryOpen != 0) {
                            if (category.idcategory == this.lastCategoryOpen)
                                categoryItem.showExpand = true;
                        } else {

                            if (countCategory == categories.length - 1) {
                                categoryItem.showExpand = true;
                                this.lastCategoryOpen = category.idcategory;
                            }
                        }

                        this.itemsCategory.add(categoryItem);
                        this.itemsCategory.tag = category;
                        countCategory++;
                    });
                } else
                    this.itemsCategory.add(this.itemsCategoryMessage);

                this.loader.hidden();
            });
        }

        /**
         * Raises the <c>categoryArchived</c> event
         */
        onCategoryArchivedChanged() {
            if (this._categoryArchivedChanged) {
                this._categoryArchivedChanged.raise();
            }
            this.loadCategory();
        }

        /**
         * Raises the <c>clickBtnCloseSession</c> event
         */
        onClickBtnCloseSession() {
            if (this._clickBtnCloseSession) {
                this._clickBtnCloseSession.raise();
            }
        }

        /**
         * Raises the <c>clickBtnReturn</c> event
         */
        onClickBtnReturn() {
            if (this._clickBtnReturn) {
                this._clickBtnReturn.raise();
            }
        }

        /**
         * Raises the <c>countChecked</c> event
         */
        onCountCheckedChanged() {
            if (this._countCheckedChanged) {
                this._countCheckedChanged.raise();
            }

            if (this.countChecked > 0) {
                this.add(this.btnDeleteSelected);
                this.add(this.btnArchiveSelected);
            } else {
                this.btnDeleteSelected.removeFromParent();
                this.btnArchiveSelected.removeFromParent();
            }
        }

        /**
         * load components (strings, style, events)
         */
        onLoad() {

            this.inpCategoryText.raw.placeholder = strings.newCategory;
            this.itemsCategoryMessage.text = strings.withoutElements;
            this.btnCloseSession.text = strings.closeSession;

            this.btnDeleteMobile.text = strings.delete;
            this.btnArchiveMobile.text = strings.archived;
            this.btnShareMobile.text = strings.share;
            this.btnSessionMobile.text = strings.closeSession;

            this.btnDeleteSelected.removeFromParent();
            this.btnArchiveSelected.removeFromParent();

            this.containerLoader.add(this.loader);
            this.cntFilterDevices.add(this.filterDevice);
            this.cntFilterState.add(this.filterState);
            this.containerModal.add(this.modal);

            this.inpCategoryText.addEventListener('keyup', ev => {
                if (ev.keyCode == 13) this.btnAddCategory_click();
            });
            this.inpCategoryText.addEventListener('keydown', ev => {
                if (ev.keyCode != 13) this.inpCategoryText.style.outlineStyle = "none";
            });

            window.addEventListener('click', ev => {
                if (ev.target == this.btnSessionUser.raw) {
                    this.changeView(this.popover, "block");
                } else {
                    this.popover.style.display = "none";
                }

                if(ev.target  == this.iconMenu.raw ){
                    this.changeView(this.containerMenuMobile, "block");
                }else{
                    this.containerMenuMobile.style.display = "none";
                }

            });

            LocalEditor.onClick(this.nameProject.raw, () => {
                if (this.evaluate(this.nameProject.text)) {
                    this.project.name = this.nameProject.text;
                    this.project.save();
                } else {
                    this.nameProject.text = this.project.name;
                }
            });
        }

        /**
         * Raises the <c>project</c> event
         */
        onProjectChanged() {
            if (this._projectChanged) {
                this._projectChanged.raise();
            }

            if (this.project != null) {
                this.nameProject.text = this.project.name;
                if (this.project.archived)
                    this.btnArchive.text = "file_upload";
                else
                    this.btnArchive.text = "archive";

                this.lastCategoryOpen = 0;
                this.loadCategory();
            }
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
         * Raises the <c>removeProject</c> event
         */
        onRemoveProject() {
            if (this._removeProject) {
                this._removeProject.raise();
            }
        }
        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _categoryArchivedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the categoryArchived property changes
         *
         * @returns {LatteEvent}
         */
        get categoryArchivedChanged(): LatteEvent {
            if (!this._categoryArchivedChanged) {
                this._categoryArchivedChanged = new LatteEvent(this);
            }
            return this._categoryArchivedChanged;
        }

        /**
         * Back field for event
         */
        private _clickBtnArch: LatteEvent;

        /**
         * Gets an event raised when click button archived
         *
         * @returns {LatteEvent}
         */
        get clickBtnArch(): LatteEvent {
            if (!this._clickBtnArch) {
                this._clickBtnArch = new LatteEvent(this);
            }
            return this._clickBtnArch;
        }

        /**
         * Back field for event
         */
        private _clickBtnCloseSession: LatteEvent;

        /**
         * Gets an event raised when close session
         *
         * @returns {LatteEvent}
         */
        get clickBtnCloseSession(): LatteEvent {
            if (!this._clickBtnCloseSession) {
                this._clickBtnCloseSession = new LatteEvent(this);
            }
            return this._clickBtnCloseSession;
        }

        /**
         * Back field for event
         */
        private _clickBtnReturn: LatteEvent;

        /**
         * Gets an event raised when click button return
         *
         * @returns {LatteEvent}
         */
        get clickBtnReturn(): LatteEvent {
            if (!this._clickBtnReturn) {
                this._clickBtnReturn = new LatteEvent(this);
            }
            return this._clickBtnReturn;
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
        private _projectChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the project property changes
         *
         * @returns {LatteEvent}
         */
        get projectChanged(): LatteEvent {
            if (!this._projectChanged) {
                this._projectChanged = new LatteEvent(this);
            }
            return this._projectChanged;
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
        private _removeProject: LatteEvent;

        /**
         * Gets an event raised when delete or archive this project
         *
         * @returns {LatteEvent}
         */
        get removeProject(): LatteEvent {
            if (!this._removeProject) {
                this._removeProject = new LatteEvent(this);
            }
            return this._removeProject;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _countChecked: number = 0;

        /**
         * Gets or sets count checked
         *
         * @returns {number}
         */
        get countChecked(): number {
            return this._countChecked;
        }

        /**
         * Gets or sets count checked
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
        private _lastCategoryOpen: number = 0;

        /**
         * Gets or sets last category open
         *
         * @returns {number}
         */
        get lastCategoryOpen(): number {
            return this._lastCategoryOpen;
        }

        /**
         * Gets or sets last category open
         *
         * @param {number} value
         */
        set lastCategoryOpen(value: number) {
            this._lastCategoryOpen = value;
        }

        /**
         * Property field
         */
        private _project: Project = null;

        /**
         * Gets or sets project
         *
         * @returns {Project}
         */
        get project(): Project {
            return this._project;
        }

        /**
         * Gets or sets project
         *
         * @param {Project} value
         */
        set project(value: Project) {

            // Check if value changed
            let changed: boolean = value !== this._project;

            // Set value
            this._project = value;

            // Trigger changed event
            if (changed) {
                this.onProjectChanged();
            }
        }

        /**
         * Property field
         */
        private _prototypeSelected: Image = null;

        /**
         * Gets or sets selected prototype
         *
         * @returns {Image}
         */
        get prototypeSelected(): Image {
            return this._prototypeSelected;
        }

        /**
         * Gets or sets selected prototype
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
        //endregion

        //region Components
        /**
         * Field for filterDevice property
         */
        private _filterDevice: FilterStatusView;

        /**
         * Gets filter devices
         *
         * @returns {FilterStatusView}
         */
        get filterDevice(): FilterStatusView {
            if (!this._filterDevice) {
                this._filterDevice = new FilterStatusView();
                this._filterDevice.addButton("", "desktop_windows");
                this._filterDevice.addButton("", "phone_iphone");
                this._filterDevice.addButton("", "devices");

                this._filterDevice.statusChanged.add(() => {
                    this.loadCategory();
                });
            }
            return this._filterDevice;
        }

        /**
         * Field for filterState property
         */
        private _filterState: FilterStatusView;

        /**
         * Gets
         *
         * @returns {FilterStatusView}
         */
        get filterState(): FilterStatusView {
            if (!this._filterState) {
                this._filterState = new FilterStatusView();
                this._filterState.addButton("", "work");
                this._filterState.addButton("", "archive");
                this._filterState.statusChanged.add(() => {
                    this.loadCategory();
                });
            }
            return this._filterState;
        }

        /**
         * Field for modal property
         */
        private _modal: Modal;

        /**
         * Gets modal
         *
         * @returns {Modal}
         */
        get modal(): Modal {
            if (!this._modal) {
                this._modal = new Modal();
            }
            return this._modal;
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