import axios from 'axios';
import { google } from 'googleapis';
import express from "express"; 
import dotenv from 'dotenv';

dotenv.config();

//  Fetch images for the current exercise
const dataSearch = async (exerciseName) => {
    try {
        // GET IMAGES FROM GOOGLE
        const apiKey = process.env.API_KEY;
        const cx = process.env.CX;

        // if (string == 'image'){
        const imageResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cx,
                q: 'gif ' + exerciseName ,
                searchType: 'image',
                num: 1 // Number of images to return per query
        }});

        // console.log(imageResponse.data.items[0].link)

        return await imageResponse.data.items[0].link
        // }
        // await axios.get('https://www.googleapis.com/customsearch/v1', {
        //     params: {
        //         key: apiKey,
        //         cx: cx,
        //         q: exerciseName,
        //         num: 1 // Number of descriptions to return per query
        //     }})

        // return descriptionResponse;

    } catch (error){
        return 'No images or descriptions found'
    }
}

export default dataSearch;