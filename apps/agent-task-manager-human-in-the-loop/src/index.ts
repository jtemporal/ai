import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/env.ts";
import type { Variables } from "./types/hono.ts";
export { TaskManagerAgent } from "./TaskManagerAgent";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();
app.use(cors());

app.post("/query", async (c) => {
	const { agentId, prompt } = await c.req.json<{
		agentId: string;
		prompt: string;
	}>();
	const id = c.env.TASK_MANAGER_AGENT.idFromName(agentId);
	const agent = c.env.TASK_MANAGER_AGENT.get(id);

	const result = await agent.query(prompt);
	return c.json(result);
});

app.post("/confirmations/:confirmationId", async (c) => {
	const { agentId, confirm } = await c.req.json<{
		agentId: string;
		confirm: boolean;
	}>();
	const confirmationId = c.req.param("confirmationId");
	const id = c.env.TASK_MANAGER_AGENT.idFromName(agentId);
	const agent = c.env.TASK_MANAGER_AGENT.get(id);

	const result = await agent.confirm(confirmationId, confirm);
	return c.json(result);
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
