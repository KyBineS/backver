"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const parserMiddLeware = (0, body_parser_1.default)({});
app.use(parserMiddLeware);
const videosDB = [
    {
        id: 1,
        title: "1+1",
        author: "Olivier Nakache",
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: "2011-09-23T00:00:00.000Z",
        publicationDate: "2011-09-23T00:00:00.000Z",
        availableResolution: ["P144"],
    },
    {
        id: 2,
        title: "1+1",
        author: "Olivier Nakache",
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: "2011-09-23T00:00:00.000Z",
        publicationDate: "2011-09-23T00:00:00.000Z",
        availableResolution: ["P144"],
    }
];
const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
//DELETE ALL
app.delete('/testing/all-data', (req, res) => {
    videosDB.splice(0, videosDB.length);
    res.send(204);
});
//RETURN ALL
app.get('/videos', (req, res) => {
    res.send(videosDB);
});
//RETURN ID
app.get('/videos/:id', (req, res) => {
    let video = videosDB.find(p => p.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
});
//find refactoring
//DELETE ID
app.get('/videos/:id', (req, res) => {
    for (let i = 0; i < videosDB.length; i++) {
        if (videosDB[i].id === +req.params.id) {
            videosDB.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
//create new
app.post('/videos', (req, res) => {
    let newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction,
        createdAt: (new Date().toISOString()),
        publicationDate: (new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
        availableResolution: req.body.availbeResolution,
    };
    let errors_array = [];
    //checking
    //title
    if (typeof newVideo.title !== "string" || newVideo.title.length > 40) {
        errors_array.push({ message: "error", field: "title" });
    }
    //author
    if (typeof newVideo.author !== "string" || newVideo.author.length > 20) {
        errors_array.push({ message: "error", field: "author" });
    }
    //availableResolution
    if (Array.isArray(newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution)) {
        const length = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution.length;
        let checking = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution.filter(value => {
            return availableResolutions.includes(value);
        });
        if (checking.length < length) {
            errors_array.push({ message: "error", field: "availableResolution" });
        }
    }
    else {
        errors_array.push({ message: "error", field: "availableResolution" });
    }
    //canBeDownloaded
    if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) !== "boolean") {
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) === undefined) {
            newVideo.canBeDownloaded = false;
        }
        else {
            errors_array.push({ message: "error", field: "canBeDownloaded" });
        }
    }
    //minAgeRestriction
    if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== 16 && typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== "number") {
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === undefined) {
            newVideo.minAgeRestriction = 16;
        }
        else {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
    }
    else if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === "number") {
        if (+(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) < 17 || +(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) > 18) {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
    }
    //endpoints
    if (errors_array.length > 0) {
        let errorsList = { errorsMessages: errors_array };
        res.status(400).send(errorsList);
    }
    else {
        videosDB.push(newVideo);
        res.status(201).send(newVideo);
    }
});
//update
app.put('/videos/:id', (req, res) => {
    let newVideo1 = videosDB.find(p => p.id === +req.params.id);
    let index = videosDB.findIndex(p => p.id === +req.params.id);
    let errors_array = [];
    //add value
    if (newVideo1) {
        const newVideo = Object.assign(Object.assign({}, newVideo1), req.body);
        //title
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.title) !== "string" || newVideo.title.length > 40) {
            errors_array.push({ message: "error", field: "title" });
        }
        //author
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.title) !== "string" || newVideo.author.length > 20) {
            errors_array.push({ message: "error", field: "author" });
        }
        //availableResolutions
        if (Array.isArray(newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution)) {
            const length = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution.length;
            let checking = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolution.filter((value) => {
                return availableResolutions.includes(value);
            });
            if (checking.length < length) {
                errors_array.push({ message: "error", field: "availableResolution" });
            }
        }
        else {
            errors_array.push({ message: "error", field: "availableResolution" });
        }
        //canBeDownloaded
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) !== "boolean") {
            errors_array.push({ message: "error", field: "canBeDownloaded" });
        }
        //minAgeRestriction
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== 16 && typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== "number") {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
        else if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === "number") {
            if (+(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) < 17 || +(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) > 18) {
                errors_array.push({ message: "error", field: "minAgeRestriction" });
            }
        }
        //publicationDate
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.publicationDate) === "string") {
            let r = /^([\+-]?\d{4}(?!\d{2}b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01])))([T\s]((([01]\d|2[0-3])(:?[0-5]\d){1,2})|24\:?00)([\.,]\d*)?(([zZ])|([\+-](0\d|1[0-2])(:?[0-5]\d)?)))?)?$/;
            if (!r.test(newVideo.publicationDate)) {
                errors_array.push({ message: "error", field: "publicationDate" });
            }
        }
        else {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
        //assigment variable
        if (errors_array.length > 0) {
            let errorsList = { errorsMessages: errors_array };
            res.status(400).send(errorsList);
        }
        else {
            videosDB[index] = newVideo;
            res.send(204);
        }
    }
    else {
        res.send(404);
    }
    ;
});
//start
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
//# sourceMappingURL=index.js.map