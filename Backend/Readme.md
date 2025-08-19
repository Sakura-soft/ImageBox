[
{
"category": "1xx - Informational",
"codes": [
{
"code": 100,
"meaning": "Continue",
"use_case": "Internal HTTP use, not for APIs"
}
]
},
{
"category": "2xx - Success",
"codes": [
{
"code": 200,
"meaning": "OK",
"use_case": "GET /profile – Successfully retrieved user profile"
},
{
"code": 201,
"meaning": "Created",
"use_case": "POST /users – User created successfully"
},
{
"code": 202,
"meaning": "Accepted",
"use_case": "Task accepted but still processing (e.g., queued file upload)"
},
{
"code": 204,
"meaning": "No Content",
"use_case": "DELETE /user/:id – User deleted, nothing to return"
}
]
},
{
"category": "3xx - Redirection",
"codes": [
{
"code": 304,
"meaning": "Not Modified",
"use_case": "Used with caching"
}
]
},
{
"category": "4xx - Client Errors",
"codes": [
{
"code": 400,
"meaning": "Bad Request",
"use_case": "Missing fields in signup (userName, email, etc.)"
},
{
"code": 401,
"meaning": "Unauthorized",
"use_case": "JWT token missing or invalid"
},
{
"code": 403,
"meaning": "Forbidden",
"use_case": "Authenticated but access denied (e.g. accessing another user’s file)"
},
{
"code": 404,
"meaning": "Not Found",
"use_case": "User or resource doesn’t exist"
},
{
"code": 409,
"meaning": "Conflict",
"use_case": "User already exists, email taken"
},
{
"code": 413,
"meaning": "Payload Too Large",
"use_case": "File upload exceeds size limit"
},
{
"code": 415,
"meaning": "Unsupported Media Type",
"use_case": "File type not supported"
},
{
"code": 422,
"meaning": "Unprocessable Entity",
"use_case": "Valid JSON but semantically invalid (e.g., weak password, wrong format)"
},
{
"code": 429,
"meaning": "Too Many Requests",
"use_case": "Rate limiting (e.g., too many OTP attempts)"
}
]
},
{
"category": "5xx - Server Errors",
"codes": [
{
"code": 500,
"meaning": "Internal Server Error",
"use_case": "Something broke on your server (DB failure, imageKit failure)"
},
{
"code": 502,
"meaning": "Bad Gateway",
"use_case": "Your server got an invalid response from an upstream service"
},
{
"code": 503,
"meaning": "Service Unavailable",
"use_case": "Server down (e.g., during deployment/maintenance)"
},
{
"code": 504,
"meaning": "Gateway Timeout",
"use_case": "Third-party service (e.g., SMTP or ImageKit) is taking too long"
}
]
},
{
"category": "Recommended Scenarios",
"scenarios": [
{
"scenario": "Successful signup",
"status": 201
},
{
"scenario": "Missing signup fields",
"status": 400
},
{
"scenario": "Email already exists",
"status": 409
},
{
"scenario": "Invalid OTP",
"status": 400
},
{
"scenario": "Expired OTP",
"status": 401
},
{
"scenario": "User not found",
"status": 404
},
{
"scenario": "Login failed (wrong password)",
"status": 401
},
{
"scenario": "Unauthorized access to file or route",
"status": 403
},
{
"scenario": "Rate limit hit (e.g., resend OTP)",
"status": 429
},
{
"scenario": "File uploaded successfully",
"status": 201
},
{
"scenario": "File type not supported",
"status": 415
},
{
"scenario": "File too large",
"status": 413
},
{
"scenario": "Internal ImageKit error",
"status": 500
},
{
"scenario": "Database save error",
"status": 500
}
]
}
]
