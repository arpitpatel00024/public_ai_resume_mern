import styles from './Dashboard.module.css';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    return `${mb.toFixed(1)} MB`;
};

const getScoreLabel = (score) => {

    if (score >= 80) {
        return "Excellent Match";
    }

    if (score >= 60) {
        return "Good Match";
    }

    if (score >= 40) {
        return "Partial Match";
    }

    return "Low Match";
};

const Dashboard = () => {

    const [uploadFiletext, setUploadFileText] = useState("");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const { userInfo } = useContext(AuthContext);

    const handleFileSelect = (file) => {
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        setResumeFile(file);
        setUploadFileText(file.name);
        setResult(null);
    };

    const handleRemoveFile = () => {
        setResumeFile(null);
        setUploadFileText("");
        setResult(null);

        const input = document.getElementById("inputField");

        if (input) {
            input.value = "";
        }
    };

    const handleOnChangeFile = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleUpload = async () => {

        setResult(null);

        if (!jobDesc || !resumeFile) {
            alert("Please fill Job Description & Upload Resume");
            return;
        }

        const formData = new FormData();

        formData.append("resume", resumeFile);
        formData.append("job_desc", jobDesc);
        formData.append("user", userInfo._id);

        setLoading(true);

        try {

            const result = await axios.post(
                '/api/resume/addResume',
                formData
            );

            setResult(result.data.data);

        } catch (err) {

            console.log(err);
            alert("Something went wrong while analyzing the resume.");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className={styles.Dashboard}>

            <div className={styles.DashboardLeft}>

                {/* HEADER */}

                <div className={styles.DashboardHeader}>

                    <div className={styles.DashboardHeaderTitle}>
                        Smart Resume Screening
                    </div>

                    <div className={styles.DashboardHeaderLargeTitle}>
                        Resume Match Score
                    </div>

                    <p className={styles.headerDescription}>
                        Upload your resume and compare it with a job description
                        using AI-powered resume analysis.
                    </p>

                </div>


                {/* INSTRUCTIONS */}

                <div className={styles.alertInfo}>

                    <div className={styles.alertTitle}>
                        🔔 Important Instructions
                    </div>

                    <div className={styles.dashboardInstruction}>

                        <div>
                            📄 Paste the complete job description before analyzing.
                        </div>

                        <div>
                            🔗 Only PDF format (.pdf) resumes are accepted.
                        </div>

                    </div>

                </div>


                {/* RESUME UPLOAD */}

                <div className={styles.uploadSection}>

                    <div className={styles.sectionLabel}>
                        01 &nbsp; Upload Resume
                    </div>

                    <div
                        className={`${styles.uploadCard} ${
                            resumeFile ? styles.fileSelected : ""
                        } ${isDragging ? styles.dragging : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >

                        <div className={styles.uploadIcon}>
                            <PictureAsPdfIcon />
                        </div>

                        <div className={styles.uploadContent}>

                            <div className={styles.uploadTitle}>
                                {resumeFile
                                    ? "Resume selected"
                                    : "Upload your resume"}
                            </div>

                            <div className={styles.uploadFileName}>
                                {resumeFile
                                    ? resumeFile.name
                                    : "PDF files only"}
                            </div>

                            {resumeFile && (
                                <div className={styles.fileMeta}>
                                    <span>PDF</span>
                                    <span className={styles.metaDot}>•</span>
                                    <span>{formatFileSize(resumeFile.size)}</span>
                                </div>
                            )}

                        </div>

                        <div className={styles.fileActions}>

                            <label
                                htmlFor="inputField"
                                className={styles.uploadButton}
                            >
                                <CloudUploadIcon />
                                {resumeFile ? "Change" : "Choose PDF"}
                            </label>

                            {resumeFile && (
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={handleRemoveFile}
                                >
                                    Remove
                                </button>
                            )}

                            <input
                                type="file"
                                accept=".pdf"
                                id="inputField"
                                onChange={handleOnChangeFile}
                            />

                        </div>

                    </div>

                </div>


                {/* JOB DESCRIPTION */}

                <div className={styles.jobSection}>

                    <div className={styles.sectionLabel}>
                        02 &nbsp; Job Description
                    </div>

                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={styles.textArea}
                        placeholder="Paste the complete job description here..."
                        rows={8}
                    />

                </div>


                {/* ANALYZE BUTTON */}

                <button
                    className={styles.AnalyzeBtn}
                    onClick={handleUpload}
                    disabled={loading || !resumeFile || !jobDesc.trim()}
                >

                    <AutoAwesomeIcon />

                    {loading
                        ? "Analyzing Resume..."
                        : "Analyze Resume"}

                </button>

            </div>


            {/* RIGHT SIDE */}

            <div className={styles.DashboardRight}>

                <div className={styles.DashboardRightTopCard}>

                    <div className={styles.aiTitle}>
                        <AutoAwesomeIcon />
                        Analyze With AI
                    </div>

                    <img
                        className={styles.profileImg}
                        src={userInfo?.photoUrl}
                        alt="Profile"
                    />

                    <h2>{userInfo?.name}</h2>

                    <p className={styles.aiDescription}>
                        Get an AI-powered compatibility score between your
                        resume and the selected job.
                    </p>

                </div>


                {/* RESULT */}

                {result && (

                    <div className={styles.resultCard}>

                        <div className={styles.resultTitle}>
                            <AutoAwesomeIcon />
                            AI Analysis Result
                        </div>


                        <div
                            className={styles.scoreRing}
                            style={{
                                "--score": `${result.score * 3.6}deg`
                            }}
                        >

                            <div className={styles.scoreRingInner}>

                                <div className={styles.score}>
                                    {result?.score}%
                                </div>

                                <div className={styles.scoreLabel}>
                                    Match Score
                                </div>

                            </div>

                        </div>


                        <div className={styles.scoreStatus}>
                            {getScoreLabel(result?.score)}
                        </div>


                        <div className={styles.feedback}>

                            <div className={styles.feedbackHeader}>

                                <div className={styles.feedbackIcon}>
                                    <AutoAwesomeIcon />
                                </div>

                                <div>
                                    <h3>AI Feedback</h3>

                                    <span>
                                        Personalized resume insights
                                    </span>
                                </div>

                            </div>


                            <div className={styles.feedbackContent}>

                                <p>
                                    {result?.feedback}
                                </p>

                            </div>


                            <div className={styles.recommendation}>

                                <div className={styles.recommendationIcon}>
                                    💡
                                </div>

                                <div>

                                    <div className={styles.recommendationTitle}>
                                        Recommendation
                                    </div>

                                    <div className={styles.recommendationText}>
                                        Review the job description carefully and highlight
                                        the skills and experience that most closely match
                                        the role.
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className={styles.loadingCard}>

                        <div className={styles.loadingIcon}>
                            <AutoAwesomeIcon />
                        </div>

                        <div className={styles.loadingTitle}>
                            Analyzing your resume
                        </div>

                        <div className={styles.loadingText}>
                            Our AI is comparing your skills and experience
                            with the job description.
                        </div>

                        <div className={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className={styles.loadingSteps}>

                            <div className={styles.loadingStep}>
                                <span className={styles.stepCheck}>✓</span>
                                Reading resume
                            </div>

                            <div className={styles.loadingStep}>
                                <span className={styles.stepCheck}>✓</span>
                                Comparing requirements
                            </div>

                            <div className={styles.loadingStep}>
                                <span className={styles.stepPending}>•</span>
                                Generating insights
                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};

export default WithAuthHOC(Dashboard);