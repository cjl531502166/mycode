import newsModel from '../models/news.model.js';
import One from '../utils/one.js';
export default {
    getNews(cb) {
        One.ajax(
            'home/notice-list',
            {},
            res => {
                newsModel.newsList = res.data.data;
                newsModel.hasNews = true;
                cb && cb()
            }
        )
    }
}