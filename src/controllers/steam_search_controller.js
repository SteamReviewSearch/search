const SteamSearchService = require("../services/steam_search_service");
const Func = require("../routes/func");

module.exports = class SteamSearchController {
  steamSearchService = new SteamSearchService();
  func = new Func();
  steamSearch = async (req, res, next) => {
    try {
      // await redisClient.connect();
      console.time("for"); // 시작
      const id = res.locals.id;
      const { keyword, slice_start } = req.body;
      let keywords = keyword;
      let key = `${keywords}+${slice_start}`;
      console.log(key);
      // 레디스에 데이터가 있는지 확인
      await redisClient.get(key, (err, result) => {
        if (error) res.status(400).send(error);
        if (data !== null) {
          console.log("have Data in redis");
          return res.json({ data });
        } else next();
      });

      if (id !== undefined && list.length) {
        await this.steamSearchService.searchLogger({ id, keywords, list });
      }
      console.timeEnd("for");
      return res.json({ data: list });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  steamSearchRender = async (req, res, next) => {
    try {
      console.time("for"); // 시작
      const id = res.locals.id;
      const { keyword, slice_start } = req.body;
      console.log("여기서");
      let keywords = keyword;

      // // 레디스에 데이터가 있는지 확인
      // await redisClient.get(`${keywords}, ${slice_start}`, (err, result) => {
      //   console.log(`${keywords}, ${slice_start}`);
      //   if (error) res.status(400).send(error);
      //   if (data !== null) {
      //     console.log("have Data in redis");
      //     res.render("index", { data: data });
      //   } else next();
      // });
      const list = await this.steamSearchService.steamSearch({
        keywords,
        filter_whether,
        slice_start,
      });
      //레디스에 저장하기
      // await redisClient.set(`${keywords}, ${slice_start}`, {
      //   data: list.toString(),
      // });

      if (id !== undefined && list.length) {
        await this.steamSearchService.searchLogger({ id, keywords, list });
      }
      console.timeEnd("for");
      res.render("index", { data: list });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  steamAppidSearch = async (req, res, next) => {
    try {
      console.time("for"); // 시작
      const id = res.locals.id;

      // GET과 POST 둘 다 받을 수 있도록 분기 작성
      // 필터 하나 있는거 제하면 다른게없음
      let request;
      if (req.query.appid) request = req.query;
      else request = req.body;
      const { appid, slice_start, filterExists, filter, sort } = request;

      if (filterExists === undefined) {
        const { reviews, game_doc } =
          await this.steamSearchService.steamAppidSearch({
            appid,
            slice_start,
            filterExists,
            sort,
          });

        res.json({ game_doc, data: reviews });
      } else {
        const { reviews, game_doc } =
          await this.steamSearchService.steamAppidSearch({
            appid,
            slice_start,
            filter,
            filterExists,
            sort,
          });
        res.json({ game_doc, data: reviews });
      }

      let keywords = { type: "onething", value: appid };
      // appid로 검색하는 경우라 키워드를 저장하지 못함.
      if (id !== undefined) {
        await this.steamSearchService.searchLogger({
          id,
          keywords,
          list: appid,
        });
      }
      console.timeEnd("for");
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  steamAppidSearchRender = async (req, res, next) => {
    try {
      console.time("for"); // 시작
      const id = res.locals.id;

      const { appid, name } = req.query;
      // keyword is appid
      const slice_start = 0;
      const sort = [{ weighted_vote_score: "desc" }];
      const { reviews, game_doc } =
        await this.steamSearchService.steamAppidSearch({
          appid,
          slice_start,
          sort,
        });
      let keywords = { type: "onething", value: appid };
      // appid로 검색하는 경우라 키워드를 저장하지 못함.
      if (id !== undefined) {
        await this.steamSearchService.searchLogger({
          id,
          keywords,
          list: appid,
        });
      }
      console.timeEnd("for");
      return res.render("search", {
        result: true,
        data: reviews,
        game_doc,
        name,
        func: this.func,
      });
    } catch (error) {
      console.log(error);
      res.render("search", {
        result: false,
        data: [],
      });
    }
  };

  searchAutocomplete = async (req, res) => {
    const { value } = req.body;
    // console.log(value)
    const list = await this.steamSearchService.searchAutocomplete({ value });
    res.json(list);
  };
};
