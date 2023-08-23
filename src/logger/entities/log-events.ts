export enum LogEventType {
  REQUEST = 'Request',
  AUTHENTICATION = 'Authentication',
  AUTHORIZATION = 'Authorization',
}

export enum LogEventReason {
  AUTHENTICATION_LOGIN_SUCCESSFUL = 'Login successful',
  AUTHENTICATION_LOGIN_FAILED = 'Login failed',
  AUTHENTICATION_LOGOUT_SUCCESSFUL = 'Logout successful',
  AUTHENTICATION_LOGOUT_FAILED = 'Logout failed',
}

export interface LogEventFingerprint {
  userIdentifier: string | 'anonymous';
  userAgent: string;
  ip: string;
}

export interface LogEventInput {
  context: string;
  metadata?: { [key: string]: any };
}

export interface LogEventOutput extends LogEventFingerprint {
  context: string;
  metadata?: { [key: string]: any };
}

export interface GeneralLogEvent extends LogEventInput {
  event_type: LogEventType;
  reason: LogEventReason;
}

export interface RequestLogEvent extends LogEventInput {
  event_type: LogEventType.REQUEST;
  reason: string;
}

export type AllowedLogEvent = GeneralLogEvent | RequestLogEvent;
