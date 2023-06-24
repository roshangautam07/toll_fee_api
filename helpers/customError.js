export function customError(status = '500', message = 'Somethings went wrong') {
    return {
        status,
        message
    };
}