import * as ping from "./ping";
import * as join from "./join";
import * as leave from "./leave";
import * as leaderboard from "./leaderboard";
import * as graph from "./graph";
import * as sync from "./sync";
import * as _delete from "./delete";

export const commands = {
  ping,
	join,
	leave,
	leaderboard,
	graph,
	sync,
	'delete' : _delete,
};