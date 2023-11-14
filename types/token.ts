import {Profile} from "oidc-client";

export interface Token {
  userInfo: Profile | null | undefined,
  idToken: string | null | undefined,
  accessToken: string | null | undefined,
  authenticated: boolean,
  isLoginPending: boolean
}
