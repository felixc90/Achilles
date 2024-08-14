import express, { Request, Response } from 'express';
import { config } from './config';
import { User, Guild } from '../models';
import mongoose from 'mongoose';

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
	const json = res.json();

	if (result.ok) {
		// const user = new User({
		// 	_id: req.params.userId,
		// 	firstName: body.athlete.firstname,
		// 	lastName: body.athlete.lastname,
		// 	profile: body.athlete.profile,
		// 	accessToken: {
		// 		accessToken: body.access_token,
		// 		refreshToken: body.refresh_token,
		// 		expiresAt: body.expires_at,
		// 		tokenType: body.token_type,
		// 		expiresIn: body.expires_in,
		// 	}
		// })
		// await user.save();

		let guild = await Guild.findOne({ _id : req.params.guildId });
		if (guild != null && !guild.members.includes(req.params.userId)) {
			guild.members.push(req.params.userId);
			await guild.save();
		}
	}

	res.json({ message : 'Hello World' })
});



mongoose
	.connect(config.MONGODB_CONNECT)
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	})
