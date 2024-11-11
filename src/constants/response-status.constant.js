const HttpResponse = {
    notFound: "NOT_FOUND",
    success: "SUCCESS_OK",
    unauthenticated: "UNAUTHENTICATED",
    internalServerError: "INTERNAL_SERVER_ERROR",
    validationFailed: "VALIDATION_FAILED",

    tokenExpired: "TOKEN_EXPIRED",
    user: {
        notActivate: "USER_NOT_ACTIVE",
        credentialNotMatch: "CREDENTIAL_NOT_MATCH"
    },
    emptyRole: "ROLE_NOT_DEFINED",
    roleShouldBeArray: "ROLE_SHOULD_BE_ARRAY",
    accessDenied: "ACCESS_DENIED"
}

module.exports = HttpResponse