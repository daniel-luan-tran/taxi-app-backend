export enum LogEventType {
  REQUEST = 'Request',
  AUTHENTICATION = 'Authentication',
  AUTHORIZATION = 'Authorization',
  ACCOUNT = 'ACCOUNT',
  USER = 'USER',
  STAFF = 'STAFF',
  DRIVER = 'DRIVER',
}

export enum LogEventReason {
  AUTHENTICATION_LOGIN_SUCCESSFUL = 'Login successful',
  AUTHENTICATION_LOGIN_FAILED = 'Login failed',
  AUTHENTICATION_LOGOUT_SUCCESSFUL = 'Logout successful',
  AUTHENTICATION_LOGOUT_FAILED = 'Logout failed',
  ACCOUNT_CREATED = 'Account created',
  ACCOUNT_UPDATED = 'Account updated',
  ACCOUNT_DELETED = 'Account deleted',
  STAFF_CREATED = 'Staff created',
  STAFF_UPDATED = 'Staff updated',
  STAFF_DELETED = 'Staff deleted',
  USER_CREATED = 'User created',
  USER_UPDATED = 'User updated',
  USER_DELETED = 'User deleted',
  DRIVER_CREATED = 'Driver created',
  DRIVER_UPDATED = 'Driver updated',
  DRIVER_DELETED = 'Driver deleted',
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
