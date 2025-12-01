import { getSusActivityService } from "../../services/commentStatsService.js";
import { myError } from "../../utils/errors.js";

export async function getSusActivity(req, res) {
    const models = req.app.locals.models;

    try {
        const users = await getSusActivityService(models);
        res.status(200).json(users);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
