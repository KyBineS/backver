"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// база данных
const videos = [
    {
        id: '1',
        title: 'Видео 1',
        description: 'Это видео 1',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        views: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        title: 'Видео 2',
        description: 'Это видео 2',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        views: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
// Константы для HTTP статус кодов
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
// Middleware для парсинга тела запроса
app.use(body_parser_1.default.json());
// DELETE /ht_01/api/testing/all-data - очистить базу данных: удалить все данные из всех таблиц/коллекций
app.delete('/ht_01/api/testing/all-data', (req, res) => {
    videos.splice(0, videos.length);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
// GET /ht_01/api/videos - вернуть все видео
app.get('/ht_01/api/videos', (req, res) => {
    res.json(videos);
});
// POST /ht_01/api/videos - создать новое видео
app.post('/ht_01/api/videos', (req, res) => {
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    const newVideo = {
        id: Date.now().toString(),
        title,
        description,
        url,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    videos.push(newVideo);
    return res.status(HTTP_STATUSES.CREATED_201).json(newVideo);
});
// GET /ht_01/api/videos/{id} - вернуть видео по id
app.get('/ht_01/api/videos/:id', (req, res) => {
    const id = req.params.id;
    const video = videos.find((v) => v.id === id);
    if (!video) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.json(video);
});
// PUT /ht_01/api/videos/{id} - обновить существующее видео по id с помощью InputModel
app.put('/ht_01/api/videos/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, url } = req.body;
    const video = videos.find((v) => v.id === id);
    if (!video) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    video.title = title || video.title;
    video.description = description || video.description;
    video.url = url || video.url;
    video.updatedAt = new Date();
    return res.json(video);
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=index.js.map