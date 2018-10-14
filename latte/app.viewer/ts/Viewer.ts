module latte {

    /**
     * Viewer Class
     */
    export class Viewer {

        constructor() {
            if( window['guid'] != "" ){
                Image.byGuid( window['guid'] ).send( prototype => {
                    let mount_point = document.querySelector('.mount-point');

                    if( prototype ){
                        let prototypeView = new PrototypeView();
                        prototypeView.prototype = prototype;
                        prototypeView.appendTo(<HTMLElement>mount_point);
                    }else{
                        let errorView = new ErrorView();
                        errorView.appendTo(<HTMLElement>mount_point);
                    }
                });
            }
        }
    }

}