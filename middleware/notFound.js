export default notFound;

function notFound(req, res, next) {
    if (req.is('application/json')) {

        return res.status(404).send({
            message: `Request route ${req.url} Not found`,
            data: [],
            error: [],
        });
    }
}