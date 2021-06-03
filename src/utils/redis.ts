import driver from "ioredis";
import bunyan from "bunyan";

const { redis } = require("../../config.json");

export default class Redis extends driver {
	private log: bunyan;

	constructor(log: bunyan) {
		super(redis);

		this.log = log;
	}

	async addNewVerification(
		guildId: string,
		userId: string,
		level: string,
		key: string
	) {
		return this.pipeline()
			.hset(`verification:${key}`, {
				guildId,
				userId,
				level,
			})
			.expire(`verification:${key}`, 600)
			.exec();
	}

	async getVerificationKey(key: any) {
		return this.hgetall(`verification:${key}`);
	}

	async removeVerification(key: any) {
		return this.del(`verification:${key}`);
	}
}
