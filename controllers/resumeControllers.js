// formData:

//   filename: "name"
//   pdf_file: "file in bytes"
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const FAST_API_URL = process.env.FAST_API_URL;
import FormData from 'form-data';
export async function fileUpload  (req, res){
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const formData = new FormData();
        formData.append('filename', req.body.filename);
        formData.append('pdf_file', req.file.buffer, req.file.originalname); // Properly send file

        // Forward request to FastAPI
        const response = await axios.post(`${FAST_API_URL}/api/upload`, formData, {
            headers: formData.getHeaders(), // Ensure correct headers
        });

        res.json(response.data);

        // res.json({ message: 'File uploaded successfully',formData });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
};
export async function parseResume(req,res){
    //send api request to resume parser
    //get the parsed data
    //send the parsed data back to the client
    // const response=await axios.get(`${FASTAPI_URL}/api/parse`);
    try{
        const file_name=req.body.filename;
        console.log('file_name:',file_name);
        if(!file_name) return res.status(400).json({error:'No file name provided'});
        const response=await axios.post(`${FAST_API_URL}/api/resume-parse`,{filename:file_name});
        res.status(200).json(response.data);
    }
        catch(error){
            console.error('Parsing Error:', error);
            res.status(500).json({ error: 'Parsing failed' });
        }



}
export async function checkResume(req,res){
    const jd=req.body.jd;
    const file_name=req.body.filename;
    if(!jd) return res.status(400).json({error:'No job description provided'});
    if(!file_name) return res.status(400).json({error:'No file name provided'});

    try{
        const response=await axios.post(`${FAST_API_URL}/api/resume-check`,{jd,filename:file_name});
        res.status(200).json({message:'Resume checked successfully',data:response.data});
    }catch(error){
        console.error('Check Error:', error);
        res.status(500).json({ error: 'Check failed' });
    }

}