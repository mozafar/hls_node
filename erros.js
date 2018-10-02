class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.message = message;
    }
}

class UnauthorizedError extends Error{
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.message = message;
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.message = message;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
        this.message = message;
    }
}

class NoFileRecordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoFileRecordError';
        this.message = message;
    }
}


class NoFileError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoFileError';
        this.message = message;
    }
}

class XMLParserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'XMLParserError';
        this.message = message;
    }
}

class DatabseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabseError';
        this.message = message;
    }
}
module.exports = { 
    NotFoundError, 
    BadRequestError,
    UnauthorizedError,
    ConflictError,
    NoFileRecordError,
    NoFileError,
    XMLParserError,
    DatabseError,
};