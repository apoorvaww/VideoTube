class ApiResponse {
    constructor(statusCode, data, messsage='Success') {
        this.statusCode = statusCode
        this.data = data
        this.messsage=messsage
        this.success=statusCode < 400
    }
}

export {ApiResponse}

/// client error: 400-499 and server error: 500-599, information response: 100-199