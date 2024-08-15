export interface IUser {
	_id: string,
	athleteId: string,
	firstName: string,
	lastName: string,
	profile: string,
	accessToken: {
		accessToken: string
		refreshToken: string
		expiresAt: Number
		expiresIn: Number
		tokenType: string
	}
}