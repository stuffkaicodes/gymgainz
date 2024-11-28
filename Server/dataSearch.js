import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

//  Fetch images for the current exercise
const dataSearch = async (exerciseName) => {
    try {
        // GET IMAGES FROM GOOGLE
        // const apiKey = process.env.API_KEY;
        // const cx = process.env.CX;

        console.log('gif ' + exerciseName);

        // if (string == 'image'){
        const imageResponse = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                key: process.env.API,
                cx: process.env.CX,
                q: "gif " + exerciseName ,
                searchType: "image",
                num: 1, // Number of images to return per query
                alt: "json",
        }});

        console.log(imageResponse.data)

        // return await imageResponse.data

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
        console.log('Error:', error);
    }
}

export default dataSearch;