export enum CODES {
  // Information Responses
  //-----------------------------------------------------
  /**
   * The server has received the request headers and the client should proceed to send the request body.
   */
  CONTINUE = 100,
  /**
   * The requester has asked the server to switch protocols and the server has agreed to do so.
   */
  SWITCHING,

  // Success Responses
  //-----------------------------------------------------
  /**
   * Standard response for successful HTTP requests.
   */
  OK = 200,
  /**
   * The request has been fulfilled, resulting in the creation of a new resource.
   */
  CREATED,
  /**
   * The request has been accepted for processing, but the processing has not been completed.
   */
  ACCEPTED,
  /**
   * The server is a transforming proxy
   */
  NON_AUTHORITATIVE,
  /**
   * The server successfully processed the request and is not returning any content.
   */
  NO_CONTENT,
  /**
   * The server successfully processed the request, but is not returning any content.
   */
  RESET_CONTENT,

  // Redirection Responses
  //-----------------------------------------------------
  REDIRECT = 300,

  // Client Errors Responses
  //-----------------------------------------------------
  /**
   * The server cannot or will not process the request due to an apparent client error
   */
  BAD_REQUEST = 400,
  /**
   * Authentication is required and has failed or has not yet been provided.
   */
  UNAUTHORIZED,
  PAYMENT_REQUIRED,
  /**
   * The request was valid, but the server is refusing action.
   */
  FORBIDDEN,
  /**
   * The requested resource could not be found but may be available in the future.
   */
  NOT_FOUND,
  /**
   * A request method is not supported for the requested resource.
   */
  METHOD_NOT_ALLOWED,
  /**
   * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
   */
  NOT_ACCEPTABLE,
  /**
   * The client must first authenticate itself with the proxy.
   */
  PROXY_AUTHENTICATION_REQUIRED,
  /**
   * The server timed out waiting for the request.
   */
  REQUEST_TIMEOUT,
  /**
   * Indicates that the request could not be processed because of conflict in the request.
   */
  CONFLICT,
  /**
   * Indicates that the resource requested is no longer available and will not be available again.
   */
  GONE,
  /**
   * The request did not specify the length of its content, which is required by the requested resource.
   */
  LENGTH_REQUIRED,
  /**
   * The request is larger than the server is willing or able to process.
   */
  REQUEST_ENTITY_TOO_LARGE = 413,
  /**
   * The URI provided was too long for the server to process.
   */
  REQUEST_URI_TOO_LONG,
  /**
   * The request entity has a media type which the server or resource does not support.
   */
  UNSUPPORTED_MEDIA_TYPE,
  /**
   * The server cannot meet the requirements of the Expect request-header field.
   */
  EXPECTATION_FAILED = 417,
  /**
   * The 423 (Locked) status code means the source or destination resource of a method is locked.
   * This response SHOULD contain an appropriate precondition or postcondition code, 
   * such as 'lock-token-submitted' or 'no-conflicting-lock'.
   */
  LOCKED = 423,
  /**
   * The server is unwilling to process the request because either an individual header field, 
   * or all the header fields collectively, are too large.
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /**
   *  indicates an expired or otherwise invalid token.
   */
  INVALID_TOKEN = 498,
  /**
   *  indicates that a token is required but was not submitted.
   */
  TOKEN_REQUIRED,

  // Server Errors Responses
  //-----------------------------------------------------
  /**
   * A generic error message.
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   */
  NOT_IMPLEMENTED,
  /**
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  BAD_GATEWAY,
  /**
   * The server is currently unavailable (because it is overloaded or down for maintenance).
   */
  SERVIC_UNAVAILABLE,
  /**
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   */
  GATEWAY_TIMEOUT,
  /**
   * The 520 error is used as a "catch-all response for when the origin server returns something unexpected".
   */
  UNKNOWN_ERROR = 520
}