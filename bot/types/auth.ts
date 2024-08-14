export interface AccessToken {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	expiresIn: number;
	refreshToken: string;
}