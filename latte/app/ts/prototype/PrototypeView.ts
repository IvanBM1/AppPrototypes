module latte {

    /**
     *
     */
    export class PrototypeView extends PrototypeViewBase {

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
         * add new mark to image
         * @param ev
         */
        private addMark(ev, idowner, owner) {

            let x = ev.layerX;
            let y = ev.layerY;

            if (y - 28 <= 0) y += 28 - y;

            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;

            let real_x = (x * 100) / scale - this.image.offsetLeft;
            let real_y = (y * 100) / scale - this.image.offsetTop;

            let markItem = new MarkItem();
            markItem.posx = real_x;
            markItem.posy = real_y;

            markItem.idowner = idowner;
            markItem.owner = owner;
            markItem.image = this.image;

            markItem.showConversation(ev);

            markItem.removeMark.add(() => {
                if (markItem != null) {
                    markItem.removeFromParent();
                    markItem = null;
                }
            });

            // this.setPositionMark( markItem, real_x, real_y);
            this.containerImage.add(markItem);
            this.showMarks();

            markItem.setPositionMark();
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

        /**
         * return true if the string is in [A-Z, 0-9] only
         * @param {string} str
         * @returns {RegExpExecArray | null}
         */
        private evaluate(str: string) {
            let exp = /^(?!.*[\#\$\%\&\´\{\}\-\~\^\`\¨])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }

        /**
         * hide the marks in the view
         */
        private hideMarks() {

            this.btnShowMarksMobile.text = strings.showItems;
            this.btnShowMarks.text = "visibility";
            this.stateMarks = false;

            this.navbarPrototype.style.opacity = "0";
            this.containerImage.style.marginTop = "0";

            let marksItems = this.containerImage.getCollection();
            for (let i = 0; i < marksItems.length; i++)
                if (marksItems[i] instanceof MarkItem) marksItems[i].hideMark();
        }

        /**
         * assign position to mark
         * @param {latte.MarkItem} markItem
         * @param {number} x
         * @param {number} y
         */
        private setPositionMark(markItem: MarkItem, x: number, y: number) {

            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;
            let newX = x * (scale / 100) + this.image.offsetLeft;
            let newY = y * (scale / 100) + this.image.offsetTop - 28;

            markItem.style.left = newX + "px";
            markItem.style.top = newY + "px";
        }

        /**
         * scrolll window to position of x,y
         * @param {number} x
         * @param {number} y
         */
        private setScrollToMark(x: number, y: number) {
            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;
            let newX = x * (scale / 100) + this.image.offsetLeft;
            let newY = y * (scale / 100) + this.image.offsetTop - 28;

            window.scrollTo(newX, newY - 100);
        }

        /**
         * set selected history item.
         * @param idowner
         */
        private setHistorySelected(idowner, owner) {
            let items = this.historyList.getCollection();
            for (let i = 0; i < items.length; i++) {
                if (items[i] instanceof HistoryItem) {
                    if (items[i].history.idhistory == idowner && items[i].history.owner == owner) {
                        items[i].style.backgroundColor = "var(--accent-color)";
                        items[i].style.color = "var(--text-icons)";
                        items[i].style.borderRadius = "2px";
                    } else {
                        items[i].style.backgroundColor = "var(--text-icons)";
                        items[i].style.color = "var(--primary-text)";
                        items[i].style.borderRadius = "2px";
                    }
                }
            }
        }

        /**
         * show marks in the view
         */
        private showMarks() {
            this.btnShowMarksMobile.text = strings.hideItems;
            this.btnShowMarks.text = "visibility_off";
            this.stateMarks = true;

            this.navbarPrototype.style.opacity = "1";
            this.containerImage.style.marginTop = "3.2em";

            let marksItems = this.containerImage.getCollection();
            for (let i = 0; i < marksItems.length; i++)
                if (marksItems[i] instanceof MarkItem) marksItems[i].showMark();
        }

        /**
         * upload change of image.
         * @param file
         */
        private uploadChange(file) {
            if (file == null) return;

            let history = new History();
            history.idimage = this.prototype.idimage;

            history.save(() => {

                History.searchOne({
                    idhistory: history.recordId,
                    trash: false
                }).send(history => {
                    let formData = new FormData();
                    formData.append('file', file);
                    formData.append('guid', history.guid);

                    let httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = () => {
                        if (httpRequest.readyState == 4)
                            this.loadLastPrototype();
                    };

                    httpRequest.open('post', 'uploadImage.php', true);
                    httpRequest.send(formData);
                });
            });
        }

        /**
         * get prototype of history
         * @param idhistory
         * @param historyArray
         * @returns {any}
         */
        private getHistory( idhistory, historyArray ){
            let i = 0;
            while( i < historyArray.length && historyArray[i].idhistory != idhistory ) i++;
            return historyArray[i];
        }

        //endregion

        //region Methods
        /**
         * archive the prototype
         */
        btnArchive_click() {
            if (this.prototype.archived) {
                this.modal.unarchiveModal(this.prototype.name, () => {
                    this.prototype.archived = false;
                    this.prototype.save(() => this.onRemovePrototype());
                });
            } else {
                this.modal.archivedModal(this.prototype.name, () => {
                    this.prototype.archived = true;
                    this.prototype.save(() => this.onRemovePrototype());
                });
            }
        }

        btnArchiveMobile_click(){
            this.btnArchive_click();
        }

        /**
         * button close dialog info prototype
         */
        btnCloseInfo_click() {
            this.changeView(this.infoPrototype, "block");
        }

        /**
         * close session of user
         */
        btnCloseSession_click() {
            this.onClickBtnCloseSession();
        }

        btnSessionMobile_click(){
            this.btnCloseSession_click();
        }

        /**
         * button delete prototype
         */
        btnDelete_click() {
            this.modal.deleteModal(this.prototype.name, () => {

                if (this.prototype.idassociate != 0) {

                    Image.searchOne({
                        idimage: this.prototype.idassociate
                    }).send(associate => {
                        associate.idassociate = 0;
                        associate.save(() => {
                            this.prototype.trash = true;
                            this.prototype.save(() => this.onRemovePrototype());
                        });
                    });
                } else {
                    this.prototype.trash = true;
                    this.prototype.save(() => this.onRemovePrototype());
                }

            });
        }

        btnDeleteMobile_click(){
            this.btnDelete_click();
        }

        /**
         * swap view desktop - mobile
         */
        btnDevice_click() {
            if (this.prototype.idassociate != 0) {
                Image.searchOne({
                    idimage: this.prototype.idassociate
                }).send(prototype => {
                    this.prototype = prototype;
                });
            }
        }

        btnDeviceMobile_click(){
            this.btnDevice_click();
        }

        /**
         * show dialog width info the prototype
         */
        btnInfoPrototype_click() {
            this.changeView(this.infoPrototype, "block");
        }

        btnInfoMobile_click(){
            this.btnInfoPrototype_click();
        }

        /**
         * click button return
         */
        btnReturnPrototype_click() {
            this.onClickBtnReturn();
        }

        /**
         * dialog to share
         */
        btnShare_click() {
            this.modal.shareModal(strings.shareHost + "guid=" + this.prototype.guid);
        }

        btnShareMobile_click(){
            this.btnShare_click();
        }

        /**
         * show marks or conversation of prototype
         */
        btnShowMarks_click() {
            this.stateMarks ? this.hideMarks() : this.showMarks();
        }

        btnShowMarksMobile_click(){
            this.btnShowMarks_click();
        }

        /**
         * load all conversation
         */
        loadConversation(idowner, owner ) {
            Conversation.byIdOwner(idowner, owner).send(conversations => {
                if (conversations.length > 0) {
                    conversations.forEach(conversation => {
                        let markItem = new MarkItem();
                        markItem.conversation = conversation;
                        markItem.image = this.image;

                        if (conversation.idconversation == this.conversationPulse) {
                            markItem.addPulse();
                            this.setScrollToMark(conversation.posx, conversation.posy);
                        }

                        this.setPositionMark(markItem, conversation.posx, conversation.posy);
                        this.containerImage.raw.appendChild(markItem.raw);
                    });
                }
                this.loader.hidden();
            });
        }

        /**
         * load history list
         */
        loadHistoryList(history) {
            this.historyList.clear();

            this.btnHistoryMobile.style.display = 'block';
            this.btnHistoryMobile.text = strings.history;

            // ASSIGN ITEM OF VERSION 0 - PROTOTYPE ORIGIN
            let historyItem = new HistoryItem();
            let historyrecord = new History();
            historyrecord.owner = "Image";
            historyrecord.idhistory = this.prototype.idimage;
            historyItem.history = historyrecord;
            historyItem.click.add(() => this.loadImage(this.prototype.guid, this.prototype.idimage, "Image"));
            historyItem.text = "V0 : " + this.prototype.created.toString();
            this.historyList.add(historyItem);
            // END OF ASSIGN

            history.forEach((item, index) => {
                let historyItem = new HistoryItem();
                historyItem.history = item;
                historyItem.history.owner = "History";
                historyItem.click.add(() => {
                    this.loadImage(historyItem.history.guid, historyItem.history.idhistory, "History");
                });

                historyItem.text = "V" + (index + 1) + " : " + item.created.toString();

                this.historyList.add(historyItem);
            });
        }

        /**
         * load image width guid of prototype.
         * @param guid
         */
        loadImage(guid, idowner, owner) {

            this.idhistory = -1;
            this.containerImage.clear();

            let tagImage: Element<HTMLImageElement> = <Element<HTMLImageElement>> new MemoryElement('img');
                tagImage.element.src = strings.pathImages + guid + ".png";

            this.containerImage.add(tagImage);

            tagImage.addEventListener('load', () => {
                this.image = this.containerImage.querySelector("img");
                this.image.style.maxWidth = this.image.naturalWidth + "px";
                this.loadConversation(idowner, owner);
            });

            tagImage.addEventListener('dblclick', ev => this.addMark(ev, idowner, owner));

            this.setHistorySelected(idowner, owner );
        }

        /**
         * last update to prototype
         */
        loadLastPrototype() {
            this.loader.show();

            History.search({
                idimage: this.prototype.idimage,
                trash: 'false'
            },'idhistory ASC').send(history => {
                if (history.length > 0) {
                    this.btnHistory.style.display = "flex";
                    this.loadHistoryList(history);

                    let proto = history[history.length - 1];

                    if( this.idhistory > 0 ){
                        proto = this.getHistory( this.idhistory, history );
                        this.loadImage(proto.guid, proto.idhistory, "History");
                    }else if( this.idhistory < 0 )
                        this.loadImage(proto.guid, proto.idhistory, "History");
                    else if( this.idhistory == 0 )
                        this.loadImage(this.prototype.guid, this.prototype.idimage, "Image");

                } else {
                    this.loadImage(this.prototype.guid, this.prototype.idimage, "Image");
                    this.btnHistory.style.display = "none";
                    this.historyList.clear();
                }
            });
        }

        /**
         * load components of the view
         */
        onLoad() {

            this.btnShowMarksMobile.text = strings.hideItems;
            this.btnCloseSession.text = strings.logout;
            this.btnInfoMobile.text = strings.information;
            this.btnUploadMobile.text = strings.update;

            this.btnDeleteMobile.text = strings.delete;
            this.btnArchiveMobile.text = strings.archived;
            this.btnShareMobile.text = strings.share;

            this.btnSessionMobile.text = strings.closeSession;

            this.containerLoader.add(this.loader);
            this.containerModal.add(this.modal);

            this.fileUpdate.addEventListener('change', ev => this.uploadChange(ev.target.files[0]));

            LocalEditor.onClick(this.namePrototype.raw, () => {

                if (this.evaluate(this.namePrototype.text)) {
                    this.prototype.name = this.namePrototype.text;
                    this.prototype.save();
                } else {
                    this.namePrototype.text = this.prototype.name;
                }
            });

            LocalEditor.onClick(this.descriptionPrototype.raw, () => {

                console.log(this.descriptionPrototype.text);

                if (this.evaluate(this.descriptionPrototype.text)) {
                    this.prototype.description = this.descriptionPrototype.text;
                    this.prototype.save();
                } else
                    this.descriptionPrototype.text = this.prototype.description;
            });
            window.addEventListener('click', ev => {
                if (ev.target == this.btnSessionUser.raw) {
                    this.changeView(this.popover, "block");
                } else {
                    this.popover.style.display = "none";
                }

                if (ev.target == this.btnHistory.raw || ev.target == this.btnHistoryMobile.raw)
                    this.changeView(this.historyList, "flex");
                else {
                    this.historyList.style.display = "none";
                }

                if(ev.target  == this.iconMenu.raw ){
                    this.changeView(this.containerMenuMobile, "block");
                }else{
                    this.containerMenuMobile.style.display = "none";
                }

            });
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
         * Raises the <c>prototype</c> event
         */
        onPrototypeChanged() {
            if (this._prototypeChanged) {
                this._prototypeChanged.raise();
            }

            if (this.prototype != null) {
                this.loader.show();

                this.iconArchive.text = "archived";
                if (this.prototype.archived) this.iconArchive.text = "unarchive";


                this.btnDeviceMobile.style.display = 'none';
                this.btnHistoryMobile.style.display = 'none';

                if (this.prototype.idassociate != 0) {
                    this.btnDevice.text = "phone_iphone";

                    this.btnDeviceMobile.style.display = 'block';
                    this.btnDeviceMobile.text = strings.mobileVersion;

                    if (this.prototype.type == 2){
                        this.btnDevice.text = "desktop_windows";
                        this.btnDeviceMobile.text = strings.deskVersion;
                    }

                } else {
                    this.btnDevice.text = "";
                }

                this.namePrototype.text = this.prototype.name;
                this.descriptionPrototype.text = this.prototype.description;
                this.datePrototype.text = this.prototype.created.toString();

                this.loadLastPrototype();
            }
        }

        /**
         * Raises the <c>removePrototype</c> event
         */
        onRemovePrototype() {
            if (this._removePrototype) {
                this._removePrototype.raise();
            }
        }
        //endregion

        //region Events
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
        private _prototypeChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the prototype property changes
         *
         * @returns {LatteEvent}
         */
        get prototypeChanged(): LatteEvent {
            if (!this._prototypeChanged) {
                this._prototypeChanged = new LatteEvent(this);
            }
            return this._prototypeChanged;
        }

        /**
         * Back field for event
         */
        private _removePrototype: LatteEvent;

        /**
         * Gets an event raised when delete or archive the prototype
         *
         * @returns {LatteEvent}
         */
        get removePrototype(): LatteEvent {
            if (!this._removePrototype) {
                this._removePrototype = new LatteEvent(this);
            }
            return this._removePrototype;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _prototype: Image = null;

        /**
         * Gets or sets prototype
         *
         * @returns {Image}
         */
        get prototype(): Image {
            return this._prototype;
        }

        /**
         * Gets or sets prototype
         *
         * @param {Image} value
         */
        set prototype(value: Image) {

            // Check if value changed
            let changed: boolean = value !== this._prototype;

            // Set value
            this._prototype = value;

            // Trigger changed event
            if (changed) {
                this.onPrototypeChanged();
            }
        }

        /**
         * Property field
         */
        private _image: any = null;

        /**
         * Gets or sets image
         *
         * @returns {any}
         */
        get image(): any {
            return this._image;
        }

        /**
         * Gets or sets image
         *
         * @param {any} value
         */
        set image(value: any) {
            this._image = value;
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
         * Property field
         */
        private _stateMarks: boolean = true;

        /**
         * Gets or sets state of marks
         *
         * @returns {boolean}
         */
        get stateMarks(): boolean {
            return this._stateMarks;
        }

        /**
         * Gets or sets state of marks
         *
         * @param {boolean} value
         */
        set stateMarks(value: boolean) {
            this._stateMarks = value;
        }

        /**
         * Property field
         */
        private _conversationPulse: number = null;

        /**
         * Gets or sets idconversation add animation
         *
         * @returns {number}
         */
        get conversationPulse(): number {
            return this._conversationPulse;
        }

        /**
         * Gets or sets idconversation add animation
         *
         * @param {number} value
         */
        set conversationPulse(value: number) {
            this._conversationPulse = value;
        }

        /**
         * Property field
         */
        private _idhistory: number = -1;

        /**
         * Gets or sets idhistory
         *
         * @returns {number}
         */
        get idhistory(): number {
            return this._idhistory;
        }

        /**
         * Gets or sets idhistory
         *
         * @param {number} value
         */
        set idhistory(value: number) {
            this._idhistory = value;
        }
        //endregion

        //region components
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