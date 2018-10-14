module latte {

    /**
     * Main Class
     * Your app starts here.
     */
    export class Main {

        /**
         * Start your program on the constructor.
         */
        constructor() {

            // mount point
            let mount_point = document.querySelector('.mount-point');

            // Create main frame
            let f = new MainView();

            // Append to body
            f.appendTo(<HTMLElement>mount_point);
        }

    }

}