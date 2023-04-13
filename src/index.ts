import express, {request, response} from "express";
import bodyParser from "body-parser";
import {runInNewContext} from "vm";

const app = express();
const port = process.env.PORT || 3000;

const parserMiddLeware = bodyParser({})
app.use(parserMiddLeware)

const videosDB = [
    {
        id: 1,
        title: "1+1",
        author: "Olivier Nakache",
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: "2011-09-23T00:00:00.000Z",
        publicationDate: "2011-09-23T00:00:00.000Z",
        availableResolutions: ["P144"],
    },
    {
        id: 2,
        title: "1+1",
        author: "Olivier Nakache",
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: "2011-09-23T00:00:00.000Z",
        publicationDate: "2011-09-23T00:00:00.000Z",
        availableResolutions: ["P144"],
    }
];
const availableResolutions = ["P144" , "P240" , "P360" , "P480" , "P720" , "P1080" , "P1440" , "P2160"]

//DELETE ALL
app.delete('/testing/all-data', (req,res) =>   {
    videosDB.splice(0,videosDB.length);
    res.send(204)
})

//RETURN ALL
app.get('/videos', (req,res) => {
    res.send(videosDB);
});
//RETURN ID
app.get('/videos/:id', (req,res) =>{
    let video = videosDB.find(p => p.id === +req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.send(404)
    }
});
//find refactoring


//DELETE ID
app.delete('/videos/:id', (req,res) =>{
    for(let i = 0; i < videosDB.length; i++){
        if(videosDB[i].id === +req.params.id){
            videosDB.splice(i,1)
            res.sendStatus(204)
            return;
        }
    }
    res.sendStatus(404)
});


//create new
app.post('/videos', (req,res) => {
    let newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction,
        createdAt: (new Date().toISOString()),
        publicationDate: (new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
        availableResolutions: req.body.availableResolutions,
    }
    let errors_array =[];
    //checking
    //title
    if(typeof newVideo.title !== "string" || newVideo.title.length > 40){
        errors_array.push({message: "error", field: "title"})
    }
    //author
    if(typeof newVideo.author !== "string" || newVideo.author.length > 20){
        errors_array.push({message: "error", field: "author"})
    }
    //availableResolutions
    if(Array.isArray(newVideo?.availableResolutions)){
        const length = newVideo?.availableResolutions.length
        let checking = newVideo?.availableResolutions.filter(value => {
            return availableResolutions.includes(value)
        })
        if(checking.length < length){
            errors_array.push({message: "error" , field: "availableResolutions"})
        }
    } else {
        errors_array.push({message: "error", field: "availableResolutions"})
    }
    //canBeDownloaded
    if(typeof newVideo?.canBeDownloaded !== "boolean"){
        if(newVideo?.canBeDownloaded === undefined){
            newVideo.canBeDownloaded = false
        } else {
            errors_array.push({message: "error", field: "canBeDownloaded"})
        }
    }
    //minAgeRestriction
    if(newVideo?.minAgeRestriction !== 16 && typeof newVideo?.minAgeRestriction !== "number"){
        if(newVideo?.minAgeRestriction === undefined){
            newVideo.minAgeRestriction = 16
        } else {
            errors_array.push({message: "error", field: "minAgeRestriction"})
        }
    }
    else if(typeof newVideo?.minAgeRestriction === "number"){
        if (+newVideo?.minAgeRestriction < 17 || +newVideo?.minAgeRestriction > 18){
            errors_array.push({message: "error", field: "minAgeRestriction"})
        }
    }
    //endpoints
    if(errors_array.length > 0){
        let errorsList = {errorsMessages : errors_array}
        res.status(400).send(errorsList)
    } else {
        videosDB.push(newVideo)
        res.status(201).send(newVideo)
    }
})

//update
app.put('/videos/:id', (req,res) => {
    let newVideo1 = videosDB.find(p => p.id === +req.params.id);
    let index = videosDB.findIndex(p => p.id === +req.params.id)
    let errors_array =[];
    //add value
    if(newVideo1){
        const newVideo = {...newVideo1,...req.body};
        //title
        if(typeof newVideo?.title !== "string" || newVideo.title.length > 40){
            errors_array.push({message: "error", field: "title"})
        }
        //author
        if(typeof newVideo?.title !== "string" || newVideo.author.length > 20){
            errors_array.push({message: "error", field: "author"})
        }
        //availableResolutions
        if (Array.isArray(newVideo?.availableResolutions)){
            const length = newVideo?.availableResolutions.length
            let checking = newVideo?.availableResolutions.filter((value: string) => {
                return availableResolutions.includes(value)
            })
            if (checking.length < length){
                errors_array.push({message: "error", field: "availableResolutions"})
            }
        } else {
            errors_array.push({message: "error", field: "availableResolutions"})
        }
        //canBeDownloaded
        if(typeof newVideo?.canBeDownloaded !== "boolean"){
            errors_array.push({message: "error", field: "canBeDownloaded"})
        }
        //minAgeRestriction
        if(newVideo?.minAgeRestriction !== 16 && typeof newVideo?.minAgeRestriction !== "number"){
            errors_array.push({message: "error", field: "minAgeRestriction"})
        } else if(typeof newVideo?.minAgeRestriction === "number"){
            if (+newVideo?.minAgeRestriction < 17 || +newVideo?.minAgeRestriction > 18){
                errors_array.push({message: "error", field: "minAgeRestriction"})
            }
        }
        //publicationDate
        if(typeof newVideo?.publicationDate === "string"){
            let r = /^([\+-]?\d{4}(?!\d{2}b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01])))([T\s]((([01]\d|2[0-3])(:?[0-5]\d){1,2})|24\:?00)([\.,]\d*)?(([zZ])|([\+-](0\d|1[0-2])(:?[0-5]\d)?)))?)?$/
            if (!r.test(newVideo.publicationDate)){
                errors_array.push({message: "error", field: "publicationDate"})
            }
        } else {
            errors_array.push({message: "error", field: "minAgeRestriction"})
        }
        //assigment variable
        if (errors_array.length > 0){
            let errorsList = { errorsMessages: errors_array}
            res.status(400).send(errorsList)
        } else {
            videosDB[index] = newVideo;
            res.send(204)
        }
    } else {
        res.send(404)
    };
})
//start
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})