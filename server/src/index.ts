import express, { Request, Response } from 'express';
import { config } from './config';
import { User, Guild } from '../../db';

const app = express();

const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

app.get('/callback/:guildId/:userId', async (req: Request, res: Response) => {
	const code = req.query.code || null;

	const authOptions = {
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			client_id: config.STRAVA_CLIENT_ID,
			client_secret: config.STRAVA_CLIENT_SECRET,
			code: code,
			grant_type: 'authorization_code'
		}),
	};

	const result = await fetch('https://www.strava.com/oauth/token', authOptions);
	const json = await result.json();

	if (result.ok) {
		const user = new User({
			_id: req.params.userId,
			stravaId: json.athlete.id,
			firstName: json.athlete.firstname,
			lastName: json.athlete.lastname,
			profile: json.athlete.profile,
			accessToken: {
				accessToken: json.access_token,
				refreshToken: json.refresh_token,
				expiresAt: json.expires_at,
				tokenType: json.token_type,
				expiresIn: json.expires_in,
			}
		})
		await user.save();

		let guild = await Guild.findOne({ _id : req.params.guildId });
		if (guild != null && !guild.members.includes(req.params.userId)) {
			guild.members.push(req.params.userId);
			await guild.save();
		}
	}

	res.json({ message : 'Hello World' })
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
