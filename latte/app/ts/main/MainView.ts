module latte {

    /**
     *
     */
    export class MainView extends MainViewBase {

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
        private closeSession() {
            this.projectsView.projectSelected = null;
            this.loader.show();

            User.logout().send(result => {
                if (result) {
                    this.items.setChildren([this.sessionView]);
                    this.loader.hidden();
                }
            });
        }

        /**
         * return true if the string is in [A-Z, 0-9] only
         * @param {string} str
         * @returns {RegExpExecArray | null}
         */
        private evaluate(str: string) {
            let exp = /^(?!.*[\!\"\#\$\%\&\(\)\=\'\¿\¡\<\>\´\+\{\}\-\~\^\`\*\¨\:\;])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }

        private loadProject(idcategory) {

            Project.search({})

            Project.byIdCategory(idcategory).send(project => {
                this.projectView.project = project;
                this.items.setChildren([this.projectView]);
            });
        }

        //endregion

        //region Methods
        /**
         * Assign events to notification view elements
         * @param {latte.NotificationView} view
         */
        loadNotificationView(view: NotificationView) {
            view.notificationSelectedChanged.add(() => {
                let notification = view.notificationSelected;

                this.prototypeView.conversationPulse = notification.idconversation;

                if( notification.owner == "History" ) {
                    this.prototypeView.idhistory = notification.idowner;
                } else {
                    this.prototypeView.idhistory = 0;
                }

                this.prototypeView.prototype = notification.prototype;

                this.prototypeView.containerNotifications.add(this.notificationView);
                this.items.setChildren([this.prototypeView]);
            });
        }

        /**
         * Assign events to projects view elements
         * @param {latte.ProjectsView} view
         */
        loadProjectsView(view: ProjectsView) {

            view.containerNotifications.add(this.notificationView);
            view.projectSelectedChanged.add(() => {
                this.projectView.project = view.projectSelected;
                this.projectView.containerNotifications.add(this.notificationView);
                this.items.setChildren([this.projectView]);
            });
            view.btnAddProjectClick.add(() => {
                this.loader.show();

                let project = new Project();
                project.name = strings.newProject;
                project.save(() => {
                    let category = new Category();
                    category.name = strings.newCategory;
                    category.idproject = project.idproject;
                    category.save(() => {
                        this.projectView.project = project;
                        this.items.setChildren([this.projectView]);
                        this.loader.hidden();
                    });
                });
            });
            view.clickBtnCloseSession.add(() => this.closeSession());
        }

        /**
         * Assign events to project view elements
         * @param {latte.ProjectView} view
         */
        loadProjectView(view: ProjectView) {
            view.removeProject.add(() => {
                this.projectsView.loadProjects();
                this.items.setChildren([this.projectsView]);
            });
            view.clickBtnReturn.add(() => {
                this.projectsView.projectSelected = null;
                this.projectsView.loadProjects();
                this.projectsView.containerNotifications.add(this.notificationView);
                this.items.setChildren([this.projectsView]);
            });
            view.clickBtnCloseSession.add(() => this.closeSession());
            view.prototypeSelectedChanged.add(() => {
                if (view.prototypeSelected != null) {
                    this.prototypeView.prototype = view.prototypeSelected;
                    this.prototypeView.containerNotifications.add(this.notificationView);
                    this.items.setChildren([this.prototypeView]);
                }
            });
        }

        /**
         * Assign events to session view elements
         * @param {latte.PrototypeView} view
         */
        loadPrototypeView(view: PrototypeView) {

            view.clickBtnCloseSession.add(() => this.closeSession());
            view.clickBtnReturn.add(() => {
                this.projectView.prototypeSelected = null;
                if (this.projectView.project == null) this.loadProject(view.prototype.idcategory);
                else {
                    this.projectView.loadCategory();
                    this.items.setChildren([this.projectView]);
                }
                this.projectView.containerNotifications.add(this.notificationView);
            });
            view.removePrototype.add(() => {
                this.projectView.loadCategory();
                this.items.setChildren([this.projectView]);
            });
        }

        /**
         * Assign events to session view elements
         * @param {latte.SessionView} view
         */
        loadSessionView(view: SessionView) {
            view.clickBtnSession.add(() => {
                let name = view.usernameSession.text;
                let password = view.passwordSession.text;
                if (this.evaluate(name) && this.evaluate(password) ) {
                    User.login({
                        name: name,
                        password: password
                    }).send(response => {
                        if (response) {
                            this.sessionView.passwordSession.text = "";
                            this.items.setChildren([this.projectsView]);
                        }
                        else
                            this.sessionView.showError();
                    });
                } else
                    this.sessionView.showError();
            });
        }

        /**
         * load components
         */
        onLoad() {
            User.isLogin().send(response => {
                if (response)
                    this.items.setChildren([this.projectsView]);
                else
                    this.items.setChildren([this.sessionView]);
            });
            this.containerLoader.add(this.loader);
        }

        //endregion

        //region Events
        //endregion

        //region Properties
        //endregion

        //region Components
        /**
         * Field for projectsView property
         */
        private _projectsView: ProjectsView;

        /**
         * Gets the projects view
         *
         * @returns {ProjectsView}
         */
        get projectsView(): ProjectsView {
            if (!this._projectsView) {
                this._projectsView = new ProjectsView();
                this.loadProjectsView(this._projectsView);
            }
            return this._projectsView;
        }

        /**
         * Field for projectView property
         */
        private _projectView: ProjectView;

        /**
         * Gets project view
         *
         * @returns {ProjectView}
         */
        get projectView(): ProjectView {
            if (!this._projectView) {
                this._projectView = new ProjectView();
                this.loadProjectView(this._projectView);
            }
            return this._projectView;
        }

        /**
         * Field for prototypeView property
         */
        private _prototypeView: PrototypeView;

        /**
         * Gets prototype view
         *
         * @returns {PrototypeView}
         */
        get prototypeView(): PrototypeView {
            if (!this._prototypeView) {
                this._prototypeView = new PrototypeView();
                this.loadPrototypeView(this._prototypeView);
            }
            return this._prototypeView;
        }

        /**
         * Field for sessionView property
         */
        private _sessionView: SessionView;

        /**
         * Gets session view
         *
         * @returns {SessionView}
         */
        get sessionView(): SessionView {
            if (!this._sessionView) {
                this._sessionView = new SessionView();
                this.loadSessionView(this._sessionView);
            }
            return this._sessionView;
        }

        /**
         * Field for loader property
         */
        private _loader: LoaderItem;

        /**
         * Gets
         *
         * @returns {LoaderItem}
         */
        get loader(): LoaderItem {
            if (!this._loader) {
                this._loader = new LoaderItem();
            }
            return this._loader;
        }

        /**
         * Field for notificationView property
         */
        private _notificationView: NotificationView;

        /**
         * Gets notifications view
         *
         * @returns {NotificationView}
         */
        get notificationView(): NotificationView {
            if (!this._notificationView) {
                this._notificationView = new NotificationView();
                this.loadNotificationView(this._notificationView);
            }
            return this._notificationView;
        }

        //endregion


    }
}