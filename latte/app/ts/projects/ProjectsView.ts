module latte {

    /**
     *
     */
    export class ProjectsView extends ProjectsViewBase {


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
         * click button add project
         */
        btnAdd_click() {
            this.onBtnAddProjectClick();
        }

        /**
         * click button close session
         */
        btnCloseSession_click() {
            this.onClickBtnCloseSession();
        }

        /**
         * load projects
         */
        loadProjects() {

            let archived = (this.filterStatus.status == 2) ? true : false;
            this.itemsProject.clear();

            Project.search({
                archived: archived? '1' : '0',
                trash: '0'
            }).send(projects => {

                console.log(projects);

                if (!!projects.length) {
                    this.itemsProject.clear();
                    projects.forEach(project => {
                        let projectItem = new ProjectItem();
                        projectItem.project = project;
                        projectItem.click.add(() => {
                            this.projectSelected = project;
                        });
                        this.itemsProject.add(projectItem);
                    });
                } else
                    this.itemsProject.add(this.itemsProjectMessage);

                if (!archived)
                    this.itemsProject.add(this.btnAdd);
            });
        }

        /**
         * Raises the <c>btnAddProjectClick</c> event
         */
        onBtnAddProjectClick() {
            if (this._btnAddProjectClick) {
                this._btnAddProjectClick.raise();
            }
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
         * Raises the <c>projectSelected</c> event
         */
        onProjectSelectedChanged() {
            if (this._projectSelectedChanged) {
                this._projectSelectedChanged.raise();
            }
        }

        /**
         * load all components
         */
        onLoad() {

            this.title.text = strings.goplek;
            this.btnCloseSession.text = strings.closeSession;
            this.itemsProjectMessage.text = strings.withoutElements;

            this.filter.add(this.filterStatus);
            this.loadProjects();

            window.addEventListener('click', ev => {
                if (ev.target == this.btnSessionUser.raw) {
                    this.changeView(this.popover, "block");
                } else {
                    this.popover.style.display = "none";
                }
            });
        }

        //region Events
        /**
         * Back field for event
         */
        private _btnAddProjectClick: LatteEvent;

        /**
         * Gets an event raised when click to button add project
         *
         * @returns {LatteEvent}
         */
        get btnAddProjectClick(): LatteEvent {
            if (!this._btnAddProjectClick) {
                this._btnAddProjectClick = new LatteEvent(this);
            }
            return this._btnAddProjectClick;
        }

        /**
         * Back field for event
         */
        private _clickBtnCloseSession: LatteEvent;

        /**
         * Gets an event raised when close sesssion
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
        private _projectSelectedChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the projectSelected property changes
         *
         * @returns {LatteEvent}
         */
        get projectSelectedChanged(): LatteEvent {
            if (!this._projectSelectedChanged) {
                this._projectSelectedChanged = new LatteEvent(this);
            }
            return this._projectSelectedChanged;
        }

        //endregion


        //region Properties
        /**
         * Property field
         */
        private _projectSelected: Project = null;

        /**
         * Gets or sets project selected
         *
         * @returns {Project}
         */
        get projectSelected(): Project {
            return this._projectSelected;
        }

        /**
         * Gets or sets project selected
         *
         * @param {Project} value
         */
        set projectSelected(value: Project) {

            // Check if value changed
            let changed: boolean = value !== this._projectSelected;

            // Set value
            this._projectSelected = value;

            // Trigger changed event
            if (changed) {
                this.onProjectSelectedChanged();
            }
        }

        //endregion


        //region Components
        /**
         * Field for filterStatus property
         */
        private _filterStatus: FilterStatusView;

        /**
         * Gets filter status
         *
         * @returns {FilterStatusView}
         */
        get filterStatus(): FilterStatusView {
            if (!this._filterStatus) {
                this._filterStatus = new FilterStatusView();
                this._filterStatus.addButton("", "work");
                this._filterStatus.addButton("", "archive");

                this._filterStatus.statusChanged.add(() => this.loadProjects());
            }
            return this._filterStatus;
        }

        //endregion
    }


}