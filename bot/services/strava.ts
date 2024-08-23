import { Logger } from "../services";
import { config } from "../config";
import { AccessToken, StravaError } from "../types";
import { Activity, GetAthleteActivitesRequest } from "../types";

export class StravaService {
	constructor (private accessToken: AccessToken | undefined) {}

	public getAthleteActivities(params: GetAthleteActivitesRequest): Promise<Activity[]> {
		const paramsUrl = this.paramsFor(params);
		return this.getRequest<Activity[]>(`/athlete/activities${paramsUrl}`);
	}

	private async getRequest<TReturnType>(url: string): Promise<TReturnType> {
		return await this.makeRequest<TReturnType>("GET", url);
	}

	private async postRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType: string | undefined = undefined): Promise<TReturnType> {
			return await this.makeRequest<TReturnType>("POST", url, body, contentType);
	}

	private async putRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType: string | undefined = undefined): Promise<TReturnType> {
			return await this.makeRequest<TReturnType>("PUT", url, body, contentType);
	}

	private async deleteRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType> {
			return await this.makeRequest<TReturnType>("DELETE", url, body);
	}

	private paramsFor(args: any) {
		const params = new URLSearchParams();
		for (let key of Object.getOwnPropertyNames(args)) {
				if (args[key] || (args[key] === 0) || (!args[key] && typeof args[key] === 'boolean')) {
						params.append(key, args[key].toString());
				}
		}
		return [...params].length > 0 ? `?${params.toString()}` : "";
	}

	private async makeRequest<TReturnType>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body: any = undefined, contentType: string | undefined = undefined): Promise<TReturnType> {
		try {
			const newAccessToken = await this.getOrCreateAccessToken();
			if (newAccessToken == emptyAccessToken) {
				return null as TReturnType;
			}

			const token = newAccessToken?.accessToken;

			const fullUrl = 'https://www.strava.com/api/v3/' + url;
			const opts: RequestInit = {
				method: method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": contentType ?? "application/json"
				},
				body: body ? typeof body === "string" ? body : JSON.stringify(body) : undefined
			};
			const res = await fetch(fullUrl, opts);
			const json = await res.json();

			if (!res.ok) {
				Logger.error(this.formatStravaError(json as StravaError));
				return null as TReturnType;
			}
			
			return json as Promise<TReturnType>;
		} catch (error) {
			Logger.error(error as string)
			return null as TReturnType;
		}
	}

	private async getOrCreateAccessToken(): Promise<AccessToken> {
		try {
			if (!this.accessToken) {
				Logger.error(`Service Error: Cannot find access token due to missing field`);
				return emptyAccessToken;
			}
			if ((new Date()).getTime() / 1000 < this.accessToken.expiresAt) {
				return this.accessToken;
			}

			const authOptions = {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					client_id: config.STRAVA_CLIENT_ID,
					client_secret: config.STRAVA_CLIENT_SECRET,
					refresh_token: this.accessToken.refreshToken,
					grant_type: 'refresh_token'
				}),
			};

			// TODO: Update access token in db
			const res = await fetch('https://www.strava.com/oauth/token', authOptions);
			const json = await res.json();

			if (!res.ok) {
				Logger.error(this.formatStravaError(json));
				return emptyAccessToken;
			}

			return this.accessToken = {
				accessToken: json.access_token,
				refreshToken: json.refresh_token,
				expiresAt: json.expires_at,
				expiresIn: json.expires_in,
				tokenType: json.token_type
			}
		} catch (error) {
			Logger.error(error as string)
			return emptyAccessToken;
		}
	}

	private formatStravaError(error: StravaError) {
		return `${error.message}: ` +
			error.errors.map(e => 
				`Resource ${e.resource} cannot be accessed due to ${e.code} field ${e.field}`
			).join('and \n\t')
	}
}

// TODO: move this to constants or something
const emptyAccessToken: AccessToken = { 
	accessToken: "emptyAccessToken", 
	tokenType: "", 
	expiresAt: 0, 
	refreshToken: "", 
	expiresIn: -1 
};