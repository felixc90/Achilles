import { AccessToken } from "../types";

export const emptyAccessToken: AccessToken = { 
	accessToken: "emptyAccessToken", 
	tokenType: "", 
	expiresAt: 0, 
	refreshToken: "", 
	expiresIn: -1 
}