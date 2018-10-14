module latte {

    /**
     *
     */
    export class CommentItem2 extends CommentItem2Base {

        //region Static
        //endregion

        //region Fields
        //endregion

        /**
         * constructor
         */
        constructor() {
            super();
        }

        //region Private Methods
        //endregion

        //region Methods
        /**
         * Raises the <c>comment</c> event
         */
        onCommentChanged(){
            if(this._commentChanged){
                this._commentChanged.raise();
            }
            this.userComment.text = this.comment.name;
            this.textComment.text = this.comment.text;
            this.dateComment.text = this.comment.created.toString();
        }
        //endregion

        //region Events

        /**
         * Back field for event
         */
        private _commentChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the comment property changes
         *
         * @returns {LatteEvent}
         */
        get commentChanged(): LatteEvent{
            if(!this._commentChanged){
                this._commentChanged = new LatteEvent(this);
            }
            return this._commentChanged;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _comment: Comment = null;

        /**
         * Gets or sets comment
         *
         * @returns {Comment}
         */
        get comment(): Comment{
            return this._comment;
        }

        /**
         * Gets or sets comment
         *
         * @param {Comment} value
         */
        set comment(value: Comment){

            // Check if value changed
            let changed: boolean = value !== this._comment;

            // Set value
            this._comment = value;

            // Trigger changed event
            if(changed){
                this.onCommentChanged();
            }
        }
        //endregion

    }

}