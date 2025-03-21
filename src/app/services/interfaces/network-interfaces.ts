export interface SignInMessage {
  username: string;
  password: string;
}

export interface NetworkUser {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  user: NetworkUser;
  token: string;
}

export interface SignInResponse {
  ok: boolean;
  message: string;
  user?: AuthenticatedUser;
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}
