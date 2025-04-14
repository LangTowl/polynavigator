export interface SignInMessage {
  username: string;
  password: string;
}

export interface NetworkUser {
  username: string;
  password: string;
}

export interface SignInResponse {
  ok: boolean;
  message: string;
  token?: string;
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface Node {
  x: number;
  y: number;
  name: string
  group: string;
  kind: number;
  tags: string[];
}

export interface MapRequestResponse {
  [key : number]: Node;
}

export interface NodesToTraverse {
  ids: [number];
}

export interface NodesToTraversePayload {
  token: string;
  start: number;
  end: string;
  is_group: boolean;
}
