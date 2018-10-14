module latte {

    /**
     *
     */
    export class PrototypeItem extends PrototypeItemBase {

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

        //endregion

        //region Methods
        /**
         * load components
         */
        onLoad() {

            this.imagePrototype.addEventListener('click', () => this.onClick());
            this.namePrototype.addEventListener('click', () => {
                this.namePrototype.addClass('namePrototypeEdit');
            });

            this.check.addEventListener('change', ev => {
                this.checked = !this.checked;
            });

            this.imagePrototype.addEventListener('dragstart', ev => {
                ev.dataTransfer.setData("prototype", this.prototype.idimage);
            });

            LocalEditor.onClick(this.namePrototype.raw, () => {

                if (this.evaluate(this.namePrototype.text)) {
                    this.prototype.name = this.namePrototype.text;
                    this.prototype.save();
                } else {
                    this.namePrototype.text = this.prototype.name;
                }

                this.namePrototype.removeClass("namePrototypeEdit");
            }, () => {
                this.namePrototype.removeClass("namePrototypeEdit");
            });
        }

        /**
         * Raises the <c>click</c> event
         */
        onClick() {
            if (this._click) {
                this._click.raise();
            }
        }

        /**
         * Raises the <c>checked</c> event
         */
        onCheckedChanged() {
            if (this._checkedChanged) {
                this._checkedChanged.raise();
            }
        }

        /**
         * Raises the <c>prototype</c> event
         */
        onPrototypeChanged() {
            if (this._prototypeChanged) {
                this._prototypeChanged.raise();
            }
            this.namePrototype.text = this.prototype.name;

            let imgEl: Element<HTMLImageElement> = <Element<HTMLImageElement>> new MemoryElement('img');
            this.imagePrototype.clear();
            this.imagePrototype.add(imgEl);
            this.imagePrototype.querySelector("img").setAttribute("src", strings.pathImages + this.prototype.guid + ".png?" + new Date().getTime());

        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _click: LatteEvent;

        /**
         * Gets an event raised when click item
         *
         * @returns {LatteEvent}
         */
        get click(): LatteEvent {
            if (!this._click) {
                this._click = new LatteEvent(this);
            }
            return this._click;
        }

        /**
         * Back field for event
         */
        private _checkedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the checked property changes
         *
         * @returns {LatteEvent}
         */
        get checkedChanged(): LatteEvent {
            if (!this._checkedChanged) {
                this._checkedChanged = new LatteEvent(this);
            }
            return this._checkedChanged;
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

        //endregion

        //region Properties
        /**
         * Property field
         */
        private _checked: boolean = false;

        /**
         * Gets or sets value of checkbox
         *
         * @returns {boolean}
         */
        get checked(): boolean {
            return this._checked;
        }

        /**
         * Gets or sets value of checkbox
         *
         * @param {boolean} value
         */
        set checked(value: boolean) {

            // Check if value changed
            let changed: boolean = value !== this._checked;

            // Set value
            this._checked = value;

            // Trigger changed event
            if (changed) {
                this.onCheckedChanged();
            }
        }

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

        //endregion

    }

}