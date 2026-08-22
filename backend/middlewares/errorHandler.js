export const errorHandler = (err, req, res, next) => {
    console.error("error: ", err.stack || err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        status: statusCode >= 500? "error" : "fail",
        message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
    })
}