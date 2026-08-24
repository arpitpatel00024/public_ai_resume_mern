require("dotenv").config();

const ResumeModel = require("../Models/resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClientV2 } = require("cohere-ai");

// ==============================
// COHERE AI
// ==============================

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY
});

// ==============================
// ADD RESUME
// ==============================

exports.addResume = async (req, res) => {

    try {

        const { job_desc, user } = req.body;

        console.log("Uploaded file:", req.file);

        // ==============================
        // VALIDATE UPLOAD
        // ==============================

        if (!req.file) {
            return res.status(400).json({
                error: "No resume uploaded"
            });
        }

        if (!job_desc) {
            return res.status(400).json({
                error: "Job description is required"
            });
        }


        // ==============================
        // READ PDF
        // ==============================

        const pdfPath = req.file.path;

        const dataBuffer = fs.readFileSync(pdfPath);

        const pdfData = await pdfParse(dataBuffer);

        console.log("Resume text extracted successfully");


        // ==============================
        // CREATE PROMPT
        // ==============================

        const prompt = `
You are an expert resume screening assistant.

Compare the resume with the job description.

Give a match score from 0 to 100.

Then provide a short explanation.

Return EXACTLY in this format:

Score: 85
Reason: The candidate matches the required skills in React, Node.js and MongoDB.

RESUME:
${pdfData.text}

JOB DESCRIPTION:
${job_desc}
`;


        console.log("Sending request to Cohere...");


        // ==============================
        // COHERE CHAT
        // ==============================

        const response = await cohere.chat({

            model: "command-a-03-2025",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.3,

            max_tokens: 300

        });


        console.log("Cohere response received");


        // ==============================
        // GET AI RESPONSE
        // ==============================

        const result =
            response.message.content[0].text.trim();


        console.log("AI Result:");
        console.log(result);


        // ==============================
        // EXTRACT SCORE
        // ==============================

        const match = result.match(/Score:\s*(\d+)/i);

        const score = match
            ? parseInt(match[1], 10)
            : null;


        // ==============================
        // VALIDATE SCORE
        // ==============================

        if (
            score === null ||
            Number.isNaN(score) ||
            score < 0 ||
            score > 100
        ) {

            console.error("Invalid AI score:", result);

            // Delete uploaded PDF
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }

            return res.status(500).json({
                error: "AI analysis failed",
                message: "Could not extract a valid score from Cohere response"
            });
        }


        // ==============================
        // EXTRACT REASON
        // ==============================

        const reasonMatch =
            result.match(/Reason:\s*([\s\S]*)/i);

        const reason =
            reasonMatch
                ? reasonMatch[1].trim()
                : result;


        // ==============================
        // VALIDATE REASON
        // ==============================

        if (!reason || reason.length === 0) {

            console.error("AI did not provide a reason");

            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }

            return res.status(500).json({
                error: "AI analysis failed",
                message: "Could not extract feedback from Cohere response"
            });
        }


        // ==============================
        // SAVE TO MONGODB
        // ==============================

        const newResume = new ResumeModel({

            user,

            resume_name:
                req.file.originalname,

            job_desc,

            score,

            feedback: reason

        });


        await newResume.save();


        console.log("Resume analysis saved successfully");

        console.log("Score:", score);

        console.log("Feedback:", reason);


        // ==============================
        // DELETE TEMP PDF
        // ==============================

        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }


        // ==============================
        // SEND RESPONSE
        // ==============================

        return res.status(200).json({

            message: "Your analysis is ready",

            data: newResume

        });


    } catch (err) {

        console.error("RESUME ANALYSIS ERROR:");
        console.error(err);


        // Try to delete uploaded file if something fails
        if (req.file && req.file.path) {

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

        }


        return res.status(500).json({

            error: "Server error",

            message: err.message

        });

    }

};


// ==============================
// GET ALL RESUMES FOR USER
// ==============================

exports.getAllResumesForUser = async (req, res) => {

    try {

        const { user } = req.params;

        const resumes = await ResumeModel
            .find({ user: user })
            .sort({ createdAt: -1 });


        return res.status(200).json({

            message: "Your Previous History",

            resumes: resumes

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            error: "Server error",

            message: err.message

        });

    }

};


// ==============================
// GET ALL RESUMES FOR ADMIN
// ==============================

exports.getResumeForAdmin = async (req, res) => {

    try {

        const resumes = await ResumeModel
            .find({})
            .sort({ createdAt: -1 })
            .populate('user');


        return res.status(200).json({

            message: "Fetched All History",

            resumes: resumes

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            error: "Server error",

            message: err.message

        });

    }

};