module latte {

    /**
     *
     */
    export class PrototypeItem2 extends PrototypeItem2Base {

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
         * set text to icon
         */
        private setTextIcon() {
            if (this.desktop != null)
                this.namePrototype2.text = this.desktop.name;
            else if (this.mobile != null)
                this.namePrototype2.text = this.mobile.name;
        }

        //endregion

        //region Methods
        /**
         * Raises the <c>clickDesktop</c> event
         */
        onClickDesktop() {
            if (this._clickDesktop) {
                this._clickDesktop.raise();
            }
        }

        /**
         * Raises the <c>clickMobile</c> event
         */
        onClickMobile() {
            if (this._clickMobile) {
                this._clickMobile.raise();
            }
        }

        /**
         * Raises the <c>countUpdate</c> event
         */
        onCountUpdateChanged() {
            if (this._countUpdateChanged) {
                this._countUpdateChanged.raise();
            }

            if (this.countUpdate <= 0) {
                this.onHideLoader();
                this.onNeedRefresh();
            }
        }

        /**
         * Raises the <c>desktop</c> event
         */
        onDesktopChanged() {
            if (this._desktopChanged) {
                this._desktopChanged.raise();
            }
            if (this.desktop != null) {

                if (this.desktop.archived) this.itemDesktop.style.opacity = "0.2";

                let imgEl: Element<HTMLImageElement> = <Element<HTMLImageElement>> new MemoryElement('img');
                this.itemDesktop.clear();
                this.itemDesktop.add(imgEl);
                this.itemDesktop.style.alignItems = "flex-start";
                this.itemDesktop.style.cursor = "move";
                this.itemDesktop.querySelector("img").setAttribute("src", strings.pathImages + this.desktop.guid + ".png?" + new Date().getTime());

                this.cntCheckDesk.style.zIndex = "0";

                this.itemDesktop.style.setProperty("draggable", "true");
                this.itemDesktop.addEventListener('dragstart', ev => {
                    ev.dataTransfer.setData("prototype", this.desktop.idimage);
                });
                this.itemDesktop.addEventListener('dragenter', ev => {
                    ev.target.style.opacity = "0.2"
                });
                this.itemDesktop.addEventListener('dragleave', ev => {
                    ev.target.style.opacity = "";
                });

                this.setTextIcon();
            }
        }

        /**
         * Raises the <c>dropIcon</c> event
         */
        onDropIcon() {
            if (this._dropIcon) {
                this._dropIcon.raise();
            }
        }

        /**
         * Raises the <c>mobile</c> event
         */
        onMobileChanged() {
            if (this._mobileChanged) {
                this._mobileChanged.raise();
            }

            if (this.mobile != null) {

                if (this.mobile.archived) this.itemMobile.style.opacity = "0.2";

                let imgEl: Element<HTMLImageElement> = <Element<HTMLImageElement>> new MemoryElement('img');
                this.itemMobile.clear();
                this.itemMobile.add(imgEl);
                this.itemMobile.style.alignItems = "flex-start";
                this.itemMobile.style.cursor = "move";
                this.itemMobile.querySelector("img").setAttribute("src", strings.pathImages + this.mobile.guid + ".png?" + new Date().getTime());

                this.cntCheckMobile.style.zIndex = "0";

                this.itemMobile.style.setProperty("draggable", "true");
                this.itemMobile.addEventListener('dragstart', ev => {
                    ev.dataTransfer.setData("prototype", this.mobile.idimage);
                });
                this.itemMobile.addEventListener('dragenter', ev => {
                    ev.target.style.opacity = "0.2";
                });
                this.itemMobile.addEventListener('dragleave', ev => {
                    ev.target.style.opacity = "";
                });

                this.setTextIcon();
            }
        }

        /**
         * Raises the <c>needRefresh</c> event
         */
        onNeedRefresh() {
            if (this._needRefresh) {
                this._needRefresh.raise();
            }
        }

        /**
         * Raises the <c>isCheckDesk</c> event
         */
        onIsCheckDeskChanged() {
            if (this._isCheckDeskChanged) {
                this._isCheckDeskChanged.raise();
            }
        }

        /**
         * Raises the <c>isCheckMobile</c> event
         */
        onIsCheckMobileChanged() {
            if (this._isCheckMobileChanged) {
                this._isCheckMobileChanged.raise();
            }
        }

        /**
         * load components
         */
        onLoad() {
            this.cntCheckDesk.style.zIndex = "-1";
            this.cntCheckMobile.style.zIndex = "-1";

            this.checkDesk.addEventListener('change', ev => {
                this.isCheckDesk = !this.isCheckDesk;
            });

            this.checkMobile.addEventListener('change', ev => {
                this.isCheckMobile = !this.isCheckMobile;
            });

            this.fileDesk.addEventListener('change', ev => {
                this.uploadImage(ev.target.files[0], this.mobile.idcategory, this.mobile.idimage, 1);
            });
            this.fileMobile.addEventListener('change', ev => {
                this.uploadImage(ev.target.files[0], this.desktop.idcategory, this.desktop.idimage, 2);
            });

            this.itemDesktop.addEventListener('dblclick', () => {
                if (this.desktop != null)
                    this.onClickDesktop();
            });
            this.itemMobile.addEventListener('dblclick', () => {
                if (this.mobile != null)
                    this.onClickMobile();
            });

            this.itemDesktop.addEventListener('dragover', ev => {
                ev.preventDefault();
            });
            this.itemMobile.addEventListener('dragover', ev => {
                ev.preventDefault();
            });

            this.itemDesktop.addEventListener('drop', ev => {

                this.onDropIcon();
                this.onShowLoader();

                ev.preventDefault();
                ev.target.style.opacity = "";

                let idimage = ev.dataTransfer.getData("prototype");

                let Destination = this.desktop;
                let AssociatedDestination = this.mobile;

                Image.searchOne({
                    idimage: idimage,
                    trash: 'false'
                },'name').send(Source => {
                    if (Source.idassociate != 0) {

                        Image.searchOne({
                            idimage: Source.idassociate,
                            trash: 'false'
                        },'name').send(AssociatedSource => {
                            AssociatedSource.idassociate = 0;
                            Source.idassociate = 0;

                            this.swapImage(Destination, AssociatedDestination, Source, AssociatedSource, 1);
                        });

                    } else
                        this.swapImage(Destination, AssociatedDestination, Source, null, 1);
                });
            });
            this.itemMobile.addEventListener('drop', ev => {
                this.onDropIcon();
                this.onShowLoader();

                ev.preventDefault();
                ev.target.style.opacity = "";

                let idimage = ev.dataTransfer.getData("prototype");

                let Destination = this.desktop;
                let AssociatedDestination = this.mobile;

                let toUpdate: any = new Array();

                Image.searchOne({
                    idimage: idimage,
                    trash: 'false'
                },'name').send(Source => {
                    if (Source.idassociate != 0) {

                        Image.searchOne({
                            idimage: Source.idassociate,
                            trash: 'false'
                        },'name').send(AssociatedSource => {
                            AssociatedSource.idassociate = 0;
                            Source.idassociate = 0;
                            this.swapImage(AssociatedDestination, Destination, Source, AssociatedSource, 2);
                        });
                    } else
                        this.swapImage(AssociatedDestination, Destination, Source, null, 2);
                });
            });

            this.itemDesktop.addEventListener('dragenter', ev => {
                ev.target.style.opacity = "0.2";

                if (ev.target.className == "material-icons") {
                    ev.target.parentNode.style.opacity = "0.2";
                }
            });
            this.itemMobile.addEventListener('dragenter', ev => {
                ev.target.style.opacity = "0.2";

                if (ev.target.className == "material-icons") {
                    ev.target.parentNode.style.opacity = "0.2";
                }
            });

            this.itemDesktop.addEventListener('dragleave', ev => {
                ev.target.style.opacity = "";
            });
            this.itemMobile.addEventListener('dragleave', ev => {
                ev.target.style.opacity = "";
            });

            LocalEditor.onClick(this.namePrototype2.raw, () => {
                if (this.evaluate(this.namePrototype2.text)) {
                    if (this.desktop) {
                        this.desktop.name = this.namePrototype2.text;
                        this.desktop.save();
                    }

                    if (this.mobile) {
                        this.mobile.name = this.namePrototype2.text;
                        this.mobile.save();
                    }
                } else {
                    if (this.desktop) {
                        this.namePrototype2.text = this.desktop.name;
                    } else {
                        this.namePrototype2.text = this.mobile.name;
                    }
                }
            });
        }

        /**
         * Raises the <c>hideLoader</c> event
         */
        onHideLoader() {
            if (this._hideLoader) {
                this._hideLoader.raise();
            }
        }

        /**
         * Raises the <c>showLoader</c> event
         */
        onShowLoader() {
            if (this._showLoader) {
                this._showLoader.raise();
            }
        }

        /**
         * Exchange and association of images
         * @param {latte.Image} |
         * @param {latte.Image} AssociatedDestination
         * @param {latte.Image} Source
         * @param {latte.Image} AssociatedSource
         * @param {number} type
         */
        swapImage(Destination: Image, AssociatedDestination: Image, Source: Image, AssociatedSource: Image, type: number) {

            if (AssociatedDestination == null) {
                this.onHideLoader();
                return;
            }

            if (AssociatedDestination.idassociate == Source.idimage) {
                this.onHideLoader();
                return;
            }

            let toUpdate: any = new Array();

            if (AssociatedSource != null)
                toUpdate.push(AssociatedSource);

            if (Destination == null) {
                if (Source.idimage != AssociatedDestination.idimage) {
                    Source.idassociate = AssociatedDestination.idimage;
                    AssociatedDestination.idassociate = Source.idimage;
                }
            } else {
                if (Destination.idassociate != 0) {
                    if (Destination.idassociate != Source.idimage) {
                        Source.idassociate = Destination.idassociate;
                        AssociatedDestination.idassociate = Source.idimage;
                        Destination.idassociate = 0;
                    } else {
                        Destination.idassociate = 0;
                        AssociatedDestination.idassociate = 0;
                        Source.idassociate = 0;
                    }
                    toUpdate.push(Destination);
                }
            }

            let theCategory = Source.idcategory;

            Source.type = type;
            Source.idcategory = AssociatedDestination.idcategory;
            Source.name = AssociatedDestination.name;

            toUpdate.push(AssociatedDestination);
            toUpdate.push(Source);

            this.countUpdate = toUpdate.length;
            toUpdate.forEach(update => {
                update.save(() => {
                    this.countUpdate--;
                    if (theCategory != AssociatedDestination.idcategory)
                        this.refreshTheCategory = theCategory;
                });
            });
        }

        /**
         * Raises the <c>refreshTheCategory</c> event
         */
        onRefreshTheCategoryChanged() {
            if (this._refreshTheCategoryChanged) {
                this._refreshTheCategoryChanged.raise();
            }
        }

        /**
         * upload images
         * @param files
         */
        uploadImage(file, idcategory, idassociate, typeImage) {

            let imageFile = file;
            let newImage = new Image();
            newImage.idcategory = idcategory;
            newImage.idassociate = idassociate;
            newImage.type = typeImage;
            newImage.name = (this.desktop) ? this.desktop.name : this.mobile.name;
            newImage.description = strings.descriptionDefault;
            newImage.archived = (this.desktop) ? this.desktop.archived : this.mobile.archived;

            newImage.save(() => {

                Image.searchOne({
                    idimage: newImage.idimage
                }).send(image => {
                    if (image.idassociate != 0)
                        Image.searchOne({
                            idimage: image.idassociate
                        }).send(associate => {
                            associate.idassociate = image.idimage;
                            associate.save();
                        });

                    let formData = new FormData();
                    formData.append('file', imageFile);
                    formData.append('guid', image.guid);

                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4) {
                            this.onNeedRefresh();
                        }
                    };

                    xhr.open('post', 'uploadImage.php', true);
                    xhr.send(formData);
                });
            });
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _clickDesktop: LatteEvent;

        /**
         * Gets an event raised when click desktop
         *
         * @returns {LatteEvent}
         */
        get clickDesktop(): LatteEvent {
            if (!this._clickDesktop) {
                this._clickDesktop = new LatteEvent(this);
            }
            return this._clickDesktop;
        }

        /**
         * Back field for event
         */
        private _clickMobile: LatteEvent;

        /**
         * Gets an event raised when click mobile
         *
         * @returns {LatteEvent}
         */
        get clickMobile(): LatteEvent {
            if (!this._clickMobile) {
                this._clickMobile = new LatteEvent(this);
            }
            return this._clickMobile;
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
        private _dropIcon: LatteEvent;

        /**
         * Gets an event raised when drop icon
         *
         * @returns {LatteEvent}
         */
        get dropIcon(): LatteEvent {
            if (!this._dropIcon) {
                this._dropIcon = new LatteEvent(this);
            }
            return this._dropIcon;
        }

        /**
         * Back field for event
         */
        private _desktopChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the desktop property changes
         *
         * @returns {LatteEvent}
         */
        get desktopChanged(): LatteEvent {
            if (!this._desktopChanged) {
                this._desktopChanged = new LatteEvent(this);
            }
            return this._desktopChanged;
        }

        /**
         * Back field for event
         */
        private _mobileChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the mobile property changes
         *
         * @returns {LatteEvent}
         */
        get mobileChanged(): LatteEvent {
            if (!this._mobileChanged) {
                this._mobileChanged = new LatteEvent(this);
            }
            return this._mobileChanged;
        }

        /**
         * Back field for event
         */
        private _needRefresh: LatteEvent;

        /**
         * Gets an event raised when need refresh the category associate
         *
         * @returns {LatteEvent}
         */
        get needRefresh(): LatteEvent {
            if (!this._needRefresh) {
                this._needRefresh = new LatteEvent(this);
            }
            return this._needRefresh;
        }

        /**
         * Back field for event
         */
        private _isCheckDeskChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the isCheckDesk property changes
         *
         * @returns {LatteEvent}
         */
        get isCheckDeskChanged(): LatteEvent {
            if (!this._isCheckDeskChanged) {
                this._isCheckDeskChanged = new LatteEvent(this);
            }
            return this._isCheckDeskChanged;
        }

        /**
         * Back field for event
         */
        private _isCheckMobileChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the isCheckMobile property changes
         *
         * @returns {LatteEvent}
         */
        get isCheckMobileChanged(): LatteEvent {
            if (!this._isCheckMobileChanged) {
                this._isCheckMobileChanged = new LatteEvent(this);
            }
            return this._isCheckMobileChanged;
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
        private _showLoader: LatteEvent;

        /**
         * Gets an event raised when need show loader
         *
         * @returns {LatteEvent}
         */
        get showLoader(): LatteEvent {
            if (!this._showLoader) {
                this._showLoader = new LatteEvent(this);
            }
            return this._showLoader;
        }


        /**
         * Back field for event
         */
        private _hideLoader: LatteEvent;

        /**
         * Gets an event raised when hide loader
         *
         * @returns {LatteEvent}
         */
        get hideLoader(): LatteEvent {
            if (!this._hideLoader) {
                this._hideLoader = new LatteEvent(this);
            }
            return this._hideLoader;
        }

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _isCheckDesk: boolean = false;

        /**
         * Gets or sets value of the check desktop
         *
         * @returns {boolean}
         */
        get isCheckDesk(): boolean {
            return this._isCheckDesk;
        }

        /**
         * Gets or sets value of the check desktop
         *
         * @param {boolean} value
         */
        set isCheckDesk(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._isCheckDesk;

            // Set value
            this._isCheckDesk = value;

            // Trigger changed event
            if (changed) {
                this.onIsCheckDeskChanged();
            }
        }

        /**
         * Property field
         */
        private _isCheckMobile: boolean = false;

        /**
         * Gets or sets value of the check mobile
         *
         * @returns {boolean}
         */
        get isCheckMobile(): boolean {
            return this._isCheckMobile;
        }

        /**
         * Gets or sets value of the check mobile
         *
         * @param {boolean} value
         */
        set isCheckMobile(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._isCheckMobile;

            // Set value
            this._isCheckMobile = value;

            // Trigger changed event
            if (changed) {
                this.onIsCheckMobileChanged();
            }
        }

        /**
         * Property field
         */
        private _countUpdate: number = 0;

        /**
         * Gets or sets counter numbers of updates to database
         *
         * @returns {number}
         */
        get countUpdate(): number {
            return this._countUpdate;
        }

        /**
         * Gets or sets counter numbers of updates to database
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
        private _desktop: Image = null;

        /**
         * Gets or sets desktop (Image)
         *
         * @returns {Image}
         */
        get desktop(): Image {
            return this._desktop;
        }

        /**
         * Gets or sets desktop (Image)
         *
         * @param {Image} value
         */
        set desktop(value: Image) {

            // Check if value changed
            let changed: boolean = value !== this._desktop;

            // Set value
            this._desktop = value;

            // Trigger changed event
            if (changed) {
                this.onDesktopChanged();
            }
        }

        /**
         * Property field
         */
        private _mobile: Image = null;

        /**
         * Gets or sets mobile (Image)
         *
         * @returns {Image}
         */
        get mobile(): Image {
            return this._mobile;
        }

        /**
         * Gets or sets mobile (Image)
         *
         * @param {Image} value
         */
        set mobile(value: Image) {

            // Check if value changed
            let changed: boolean = value !== this._mobile;

            // Set value
            this._mobile = value;

            // Trigger changed event
            if (changed) {
                this.onMobileChanged();
            }
        }

        /**
         * Property field
         */
        private _refreshTheCategory: number = null;

        /**
         * Gets or sets need refresh category extern
         *
         * @returns {number}
         */
        get refreshTheCategory(): number {
            return this._refreshTheCategory;
        }

        /**
         * Gets or sets need refresh category extern
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

        //endregion

    }

}