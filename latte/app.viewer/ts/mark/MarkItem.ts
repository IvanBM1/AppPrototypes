module latte {

    /**
     *
     */
    export class MarkItem extends MarkItemBase {

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
         * add new comment
         */
        private addComment() {
            let comment = new Comment();
            comment.idconversation = this.conversation.idconversation;
            comment.name = this.inpUser.text;
            comment.text = this.inpText.text;
            comment.save(() => {
                this.loadComments();
                this.inpText.text = "";
            });
        }

        /**
         * assign position to container of the conversation
         * @param ev
         */
        private positionConversation(ev) {
            this.conversationItem.style.left = "0px";
            this.conversationItem.style.top = "0px";

            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;

            if(ev.x+330 > windowWidth ){
                this.conversationItem.style.left = "-300px";

                if( windowWidth <= 600 ){
                    let offset = ev.x+330 - windowWidth;
                    console.log( offset );
                    this.conversationItem.style.left = "-"+offset+"px";
                }

            }
            else
                this.conversationItem.style.left = "30px";


            if (ev.y+398 >= windowHeight) {
                let offTop: number = 398 - Math.abs(windowHeight - ev.y);
                this.conversationItem.style.top = "-" + offTop + "px";
            }

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
         * add class pulse of button mark item
         */
        addPulse() {
            this.btnConversation.addClass('pulseAnimation');
        }

        /**
         * click button close conversation
         */
        btnClose_click() {
            this.changeView(this.conversationItem, "block");
            if (this.conversation == null) this.onRemoveMark();
        }

        /**
         * click button send comment
         */
        btnSend_click() {
            if (this.inpUser.text != "" && this.inpText.text != "") {
                if (this.conversation == null) {
                    let conversation = new Conversation();
                    conversation.idowner = this.idowner;
                    conversation.owner = this.owner;
                    conversation.posx = this.posx;
                    conversation.posy = this.posy;

                    if (this.titleConversation.text != "")
                        conversation.affair = this.titleConversation.text;
                    else
                        conversation.affair = strings.affair;

                    conversation.save(() => {
                        this.conversation = conversation;
                        this.addComment();
                    });
                } else {
                    this.addComment();
                }
            }
        }

        /**
         * close dialog conversation and hide mark
         */
        hideMark() {
            this.style.display = "none";
        }

        /**
         * load all comments
         */
        loadComments() {
            this.itemsComment.clear();
            Comment.byIdConversation(this.conversation.idconversation).send(comments => {
                if (comments.length > 0) {
                    comments.forEach(comment => {
                        let commentItem = new CommentItem2();
                        commentItem.comment = comment;
                        this.itemsComment.add(commentItem);
                    });

                    this.itemsComment.raw.scrollTo(0, this.itemsComment.raw.scrollHeight);

                }
            });
        }

        /**
         * Raises the <c>conversation</c> event
         */
        onConversationChanged() {
            if (this._conversationChanged) {
                this._conversationChanged.raise();
            }

            this.titleConversation.text = this.conversation.affair;
            this.posx = this.conversation.posx;
            this.posy = this.conversation.posy;
        }

        /**
         * load components and events
         */
        onLoad() {
            this.inpUser.raw.placeholder = strings.name;
            // this.inpText.raw.style.setProperty("data-text", strings.comment);
            this.inpText.raw.setAttribute("data-text",strings.comment);

            this.titleConversation.text = strings.affair;
            this.btnSend.raw.value = strings.send;
            this.strSendComments.text = strings.sendComments;

            window.addEventListener('resize', () => this.setPositionMark());
            LocalEditor.onClick(this.titleConversation.raw, () => {
                if (this.titleConversation.text != "") {
                    if (this.conversation != null) {
                        this.conversation.affair = this.titleConversation.text;
                        this.conversation.save();
                    }
                } else {
                    if (this.conversation != null)
                        this.titleConversation.text = this.conversation.affair;
                    else {
                        this.titleConversation.text = strings.affair;
                    }
                }
            });

            window.addEventListener('click', ev => {
                if (ev.target == this.btnConversation.raw) {
                    this.removePulse();
                    this.showConversation(ev);
                    this.loadComments();
                }
                else if (ev.target instanceof HTMLImageElement) {
                    this.conversationItem.style.display = "none";
                    if (this.conversation == null) this.onRemoveMark();
                }
            });
        }

        /**
         * Raises the <c>removeMark</c> event
         */
        onRemoveMark() {
            if (this._removeMark) {
                this._removeMark.raise();
            }
        }

        /**
         * remove class pulse of button mark item
         */
        removePulse() {
            this.btnConversation.removeClass('pulseAnimation');
        }

        /**
         * set position of mark
         */
        setPositionMark() {
            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;
            let newx = this.posx * (scale / 100) + this.image.offsetLeft;
            let newy = this.posy * (scale / 100) + this.image.offsetTop - 28;

            this.style.left = newx + "px";
            this.style.top = newy + "px";
        }

        /**
         * show dialog of conversation
         */
        showConversation(ev) {
            this.positionConversation(ev);
            this.changeView(this.conversationItem, "block");
        }

        /**
         * show item mark
         */
        showMark() {
            this.style.display = "flex";
            // this.util.showElement(this, "flex");
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _conversationChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the conversation property changes
         *
         * @returns {LatteEvent}
         */
        get conversationChanged(): LatteEvent {
            if (!this._conversationChanged) {
                this._conversationChanged = new LatteEvent(this);
            }
            return this._conversationChanged;
        }


        /**
         * Back field for event
         */
        private _removeMark: LatteEvent;

        /**
         * Gets an event raised when need remove mark
         *
         * @returns {LatteEvent}
         */
        get removeMark(): LatteEvent {
            if (!this._removeMark) {
                this._removeMark = new LatteEvent(this);
            }
            return this._removeMark;
        }

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _conversation: Conversation = null;

        /**
         * Gets or sets conversation
         *
         * @returns {Conversation}
         */
        get conversation(): Conversation {
            return this._conversation;
        }

        /**
         * Gets or sets conversation
         *
         * @param {Conversation} value
         */
        set conversation(value: Conversation) {

            // Check if value changed
            let changed: boolean = value !== this._conversation;

            // Set value
            this._conversation = value;

            // Trigger changed event
            if (changed) {
                this.onConversationChanged();
            }
        }

        /**
         * Property field
         */
        private _posx: number = 0;

        /**
         * Gets or sets position in x
         *
         * @returns {number}
         */
        get posx(): number {
            return this._posx;
        }

        /**
         * Gets or sets pos in x
         *
         * @param {number} value
         */
        set posx(value: number) {
            this._posx = value;
        }

        /**
         * Property field
         */
        private _posy: number = 0;

        /**
         * Gets or sets position in y
         *
         * @returns {number}
         */
        get posy(): number {
            return this._posy;
        }

        /**
         * Gets or sets position in y
         *
         * @param {number} value
         */
        set posy(value: number) {
            this._posy = value;
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
         * Property field
         */
        private _idowner: number = null;

        /**
         * Gets or sets idowner
         *
         * @returns {number}
         */
        get idowner(): number {
            return this._idowner;
        }

        /**
         * Gets or sets idowner
         *
         * @param {number} value
         */
        set idowner(value: number) {
            this._idowner = value;
        }

        /**
         * Property field
         */
        private _owner: string = null;

        /**
         * Gets or sets owner
         *
         * @returns {string}
         */
        get owner(): string {
            return this._owner;
        }

        /**
         * Gets or sets owner
         *
         * @param {string} value
         */
        set owner(value: string) {
            this._owner = value;
        }
        //endregion

    }

}