const SteamSearchService = require("../services/steam_search_service");
const redisClient = require("../../redis_connection");

module.exports = class SteamSearchController {
  steamSearchService = new SteamSearchService();

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

      const list = await this.steamSearchService.steamSearch({
        keywords,
        slice_start,
      });
      //레디스에 저장하기

      await redisClient.set(key, list.toString());

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
      const { appid, slice_start, filterExists, filter } = request;
      console.log(appid, slice_start, filterExists, filter);
      if (filterExists === undefined) {
        const list = await this.steamSearchService.steamAppidSearch({
          appid,
          slice_start,
          filterExists,
        });
        res.json({ data: list });
      } else {
        const list = await this.steamSearchService.steamAppidSearch({
          appid,
          slice_start,
          filter,
          filterExists,
        });
        res.json({ data: list });
      }
      let keywords = { type: "onething", value: appid };
      // appid로 검색하는 경우라 키워드를 저장하지 못함.
      if (id !== undefined) {
        await this.steamSearchService.searchLogger({ id, appid, list });
      }
      console.timeEnd("for");
    } catch (error) {
      next(error);
    }
  };

  steamAppidSearchRender = async (req, res, next) => {
    try {
      // console.time('for');   // 시작
      const id = res.locals.id;

      const { appid, name } = req.query;
      // keyword is appid
      const slice_start = 0;
      const list = await this.steamSearchService.steamAppidSearch({
        appid,
        slice_start,
      });

      let keywords = { type: "onething", value: list[0]._source.name };
      // appid로 검색하는 경우라 키워드를 저장하지 못함.
      if (id !== undefined) {
        await this.steamSearchService.searchLogger({
          id,
          keywords,
          list: appid,
        });
      }
      // console.timeEnd('for');
      return res.render("search", {
        result: true,
        data: list,
        name,
        appid,
      });
    } catch (error) {
      console.log(error);
      res.render("search", {
        result: false,
        data: [],
      });
    }
  };
};
