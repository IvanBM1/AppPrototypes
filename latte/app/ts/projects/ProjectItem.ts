module latte {

    /**
     *
     */
    export class ProjectItem extends ProjectItemBase {

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
         * Raises the <c>click</c> event
         */
        onClick() {
            if (this._click) {
                this._click.raise();
            }
        }

        /**
         * Raises the <c>project</c> event
         */
        onProjectChanged() {
            if (this._projectChanged) {
                this._projectChanged.raise();
            }
            this.iconNameProject.text = this.project.name;
        }

        onLoad() {
            this.iconProject.addEventListener('click', () => this.onClick());
            this.iconNameProject.addEventListener('click', () => {
                this.iconNameProject.addClass("iconNameProjectEdit");
            });
            LocalEditor.onClick(this.iconNameProject.raw, () => {

                if (this.iconNameProject.text != "" && this.evaluate(this.iconNameProject.text)) {
                    this.project.name = this.iconNameProject.text;
                    this.project.save();
                } else {
                    this.iconNameProject.text = this.project.name;
                }
                this.iconNameProject.removeClass("iconNameProjectEdit");
            }, () => {
                this.iconNameProject.removeClass("iconNameProjectEdit");
            });
        }

        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _click: LatteEvent;

        /**
         * Gets an event raised when click
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

        //endregion

        //region Properties
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

        //endregion

    }

}