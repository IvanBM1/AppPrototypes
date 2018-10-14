module latte {

    /**
     *
     */
    export class SessionView extends SessionViewBase {

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
        //endregion

        //region Methods
        /**
         * close message error
         */
        btnErrorSession_click() {
            this.containerError.style.display = "none";
        }

        /**
         * Raises the <c>clickBtnSession</c> event
         */
        onClickBtnSession() {
            if (this._clickBtnSession) {
                this._clickBtnSession.raise();
            }
        }

        /**
         * load components
         */
        onLoad() {
            this.labelSession.text = strings.login;

            this.usernameSession.raw.placeholder = strings.user;
            this.passwordSession.raw.placeholder = strings.password;
            this.btnSession.text = strings.login;

            this.errorMessage.text = strings.errorSession;

            this.btnSession.addEventListener("click", () => this.onClickBtnSession());

            this.passwordSession.addEventListener('keyup', ev => {
                if (ev.keyCode == 13)
                    this.onClickBtnSession();
            });

            this.containerError.style.display = 'none';
        }

        /**
         * show container of error
         */
        showError() {
            this.containerError.style.display = 'flex';
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _clickBtnSession: LatteEvent;

        /**
         * Gets an event raised when click button login
         *
         * @returns {LatteEvent}
         */
        get clickBtnSession(): LatteEvent {
            if (!this._clickBtnSession) {
                this._clickBtnSession = new LatteEvent(this);
            }
            return this._clickBtnSession;
        }

        //endregion

        //region Properties
        //endregion

    }

}