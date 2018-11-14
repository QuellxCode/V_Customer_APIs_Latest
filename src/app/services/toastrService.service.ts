declare var showSuccessMessage: any;
declare var showErrorMessage: any;

export class ToastrService {
    constructor() {

    }


    showErrorMessages(message) {
        showErrorMessage(message);
    }


    showSuccessMessages(message) {
        showSuccessMessage(message);
    }




}