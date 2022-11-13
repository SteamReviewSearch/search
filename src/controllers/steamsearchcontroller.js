const SteamSearchService = require("../services/steamsearchservice");

module.exports = class SteamSearchController {
    steamSearchService = new SteamSearchService();
    steamSearch = async (req, res) => {
        try {
            // 쿼리스트링으로 받음
            const { keword } = req.query
            const result = await this.steamSearchService.steamSearch({ keword });
            res.status(200).json({ data: result });
        } catch (error) {
            console.log(error);
            res.status(400).json({ Type: error.name, Message: error.message });
        }
    }
};
