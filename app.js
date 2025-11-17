var errorStatus;
(function (errorStatus) {
    errorStatus[errorStatus["ERROR"] = 0] = "ERROR";
    errorStatus[errorStatus["SUCCESS"] = 1] = "SUCCESS";
    errorStatus[errorStatus["PENDING"] = 2] = "PENDING";
})(errorStatus || (errorStatus = {}));
function getErrorStatus(status) {
    switch (status) {
        case errorStatus.ERROR  :
            return "There was an error processing your request.";
        case errorStatus.SUCCESS:
            return "Your request was processed successfully.";
        case errorStatus.PENDING:
            return "Your request is still pending.";
        default:
            return "Unknown status.";
    }
}
// Example usage:
console.log(getErrorStatus(errorStatus.SUCCESS)); // Output: Your request was processed successfully.
console.log(getErrorStatus(errorStatus.ERROR)); // Output: There was an error processing your request.
console.log(getErrorStatus(errorStatus.PENDING)); // Output: Your request is still pending.
