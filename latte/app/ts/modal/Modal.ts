module latte {

    /**
     *
     */
    export class Modal extends ModalBase {

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
         * cleanModal the modal
         */
        cleanModal() {
            this.modalTitle.text = "";
            this.modalInput.value = "";
            this.modalMessage.text = "";
            this.modalMessageSub.text = "";
            this.modalIcon.text = "";

            this.clickOk.handlers = [];
            this.clickCancel.handlers = [];

            this.btnModalOk.text = strings.accept;
            this.btnModalCancel.text = strings.cancel;

            this.modalInput.style.display = 'none';
            this.modalMessage.style.margin = "30px 30px 10px 0";
        }


        /**
         * close the modal
         */
        btnClose_click() {
            this.modal.style.display = 'none';
        }

        /**
         * shows default messages to delete the item
         */
        deleteModal(objectName: string, callback) {
            this.cleanModal();
            this.modalTitle.text = strings.delete;
            this.modalMessage.text = strings.modalConfirmDelete + " " + objectName + "?";
            this.modalMessageSub.text = strings.modalConfirmDeleteSub;
            this.modalIcon.text = "warning";
            this.onOpenModal();
            this.clickOk.add(() => {
                callback();
            });
        }

        /**
         * show default message to archived the item
         * @param {string} objectName
         * @param callback
         */
        archivedModal(objectName: string, callback) {
            this.cleanModal();
            this.modalTitle.text = strings.archived;
            this.modalMessage.text = strings.modalConfirmArchived + " " + objectName + "?";
            this.modalIcon.text = "error_outline";
            this.onOpenModal();
            this.clickOk.add(() => {
                callback();
            });
        }

        /**
         * show default message to unarvhived the item
         * @param {string} objectName
         * @param callback
         */
        unarchiveModal(objectName: string, callback) {
            this.cleanModal();
            this.modalTitle.text = strings.recovery;
            this.modalMessage.text = strings.modalConfirmRecovery + " " + objectName + "?";
            this.modalIcon.text = "error_outline";
            this.onOpenModal();
            this.clickOk.add(() => {
                callback();
            });
        }

        /**
         * Raises the <c>clickCancel</c> event
         */
        onClickCancel() {
            if (this._clickCancel) {
                this._clickCancel.raise();
            }
            this.modal.style.display = 'none';
        }

        /**
         * Raises the <c>clickOk</c> event
         */
        onClickOk() {
            if (this._clickOk) {
                this._clickOk.raise();
            }
            this.modal.style.display = 'none';
        }

        /**
         * load components
         */
        onLoad() {
            this.cleanModal();
            this.btnModalOk.addEventListener('click', () => this.onClickOk());
            this.btnModalCancel.addEventListener('click', () => this.onClickCancel());

            window.addEventListener("click", ev => {
                if (ev.target == this.modal.raw)
                    this.modal.style.display = 'none';
            });
        }

        /**
         * Raises the <c>openModal</c> event
         */
        onOpenModal() {
            if (this._openModal) {
                this._openModal.raise();
            }
            this.modal.style.display = 'block';

            if (window.innerWidth >= 320 && window.innerWidth <= 479 || window.innerHeight <= 479) {
                this.modal.querySelector(".modalContent").style.width = "90%"
            }
        }

        /**
         * show modal with url
         * @param {string} path
         * @param callback
         */
        shareModal(path: string, callback?) {
            this.cleanModal();
            this.modalTitle.text = strings.share;
            this.modalInput.value = path;
            this.modalInput.style.display = "block";
            this.modalMessage.style.margin = "0";
            this.modalIcon.text = "share";
            this.btnModalOk.text = strings.copy;
            this.onOpenModal();

            this.clickOk.add(() => {
                this.modalInput.raw.select();
                document.execCommand("Copy");

                if (callback) callback();
            });

            this.clickCancel.add(() => this.cleanModal());
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _clickCancel: LatteEvent;

        /**
         * Gets an event raised when click cancel button
         *
         * @returns {LatteEvent}
         */
        get clickCancel(): LatteEvent {
            if (!this._clickCancel) {
                this._clickCancel = new LatteEvent(this);
            }
            return this._clickCancel;
        }

        /**
         * Back field for event
         */
        private _clickOk: LatteEvent;

        /**
         * Gets an event raised when click ok button
         *
         * @returns {LatteEvent}
         */
        get clickOk(): LatteEvent {
            if (!this._clickOk) {
                this._clickOk = new LatteEvent(this);
            }
            return this._clickOk;
        }

        /**
         * Back field for event
         */
        private _openModal: LatteEvent;

        /**
         * Gets an event raised when open modal
         *
         * @returns {LatteEvent}
         */
        get openModal(): LatteEvent {
            if (!this._openModal) {
                this._openModal = new LatteEvent(this);
            }
            return this._openModal;
        }

        //endregion

        //region Properties
        //endregion

    }

}