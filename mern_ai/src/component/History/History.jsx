import styles from './History.module.css';
import { Skeleton } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';


const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Partial Match";
    return "Low Match";
};


const getScoreClass = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "partial";
    return "low";
};


const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
};


const History = () => {
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const { userInfo } = useContext(AuthContext);


    useEffect(() => {
        if (!userInfo?._id) return;

        const fetchUserData = async () => {
            setLoader(true);

            try {
                const results = await axios.get(
                    `/api/resume/get/${userInfo._id}`
                );

                console.log(
                    "History data:",
                    results.data.resumes
                );

                setData(
                    results.data.resumes || []
                );

            } catch (err) {
                console.log(err);
                alert("Something Went Wrong");
            } finally {
                setLoader(false);
            }
        };

        fetchUserData();
    }, [userInfo?._id]);


    const filteredData = data.filter((item) => {
        const resumeName = (
            item.resume_name || ""
        ).toLowerCase();

        const searchMatch = resumeName.includes(
            search.toLowerCase()
        );

        const score = Number(item.score);

        let scoreMatch = true;

        if (filter === "excellent") {
            scoreMatch = score >= 80;
        }

        if (filter === "good") {
            scoreMatch = score >= 60 && score < 80;
        }

        if (filter === "partial") {
            scoreMatch = score >= 40 && score < 60;
        }

        if (filter === "low") {
            scoreMatch = score < 40;
        }

        return searchMatch && scoreMatch;
    });


    return (
        <div className={styles.History}>

            {/* HEADER */}
            <div className={styles.historyHeader}>
                <div>
                    <div className={styles.eyebrow}>
                        RESUME SCREENING
                    </div>

                    <h1>
                        Analysis History
                    </h1>

                    <p>
                        Review your previous resume screening results
                        and AI-powered insights.
                    </p>
                </div>

                <div className={styles.historyCount}>
                    <span>
                        {data.length}
                    </span>

                    <small>
                        Analyses
                    </small>
                </div>
            </div>


            {/* SEARCH & FILTER */}
            {!loader && data.length > 0 && (
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <span>🔎</span>

                        <input
                            type="text"
                            placeholder="Search resume..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <select
                        className={styles.filterSelect}
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                    >
                        <option value="all">
                            All Scores
                        </option>

                        <option value="excellent">
                            Excellent · 80%+
                        </option>

                        <option value="good">
                            Good · 60–79%
                        </option>

                        <option value="partial">
                            Partial · 40–59%
                        </option>

                        <option value="low">
                            Low · Below 40%
                        </option>
                    </select>

                    {(search || filter !== "all") && (
                        <button
                            className={styles.clearButton}
                            onClick={() => {
                                setSearch("");
                                setFilter("all");
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}


            {/* LOADING */}
            {loader && (
                <div className={styles.HistoryCardBlock}>
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className={styles.loadingCard}
                        >
                            <Skeleton
                                variant="text"
                                width="45%"
                                height={35}
                            />

                            <Skeleton
                                variant="text"
                                width="80%"
                            />

                            <Skeleton
                                variant="text"
                                width="100%"
                            />

                            <Skeleton
                                variant="text"
                                width="90%"
                            />
                        </div>
                    ))}
                </div>
            )}


            {/* HISTORY */}
            {!loader && filteredData.length > 0 && (
                <div className={styles.HistoryCardBlock}>
                    {filteredData.map((item) => {
                        const score =
                            item.score !== null &&
                            item.score !== undefined
                                ? Number(item.score)
                                : null;

                        const scoreClass =
                            score !== null
                                ? getScoreClass(score)
                                : "low";

                        return (
                            <div
                                key={item._id}
                                className={styles.HistoryCard}
                                onClick={() => setSelectedResume(item)}
                                role="button"
                                tabIndex={0}
                            >
                                {/* CARD TOP */}
                                <div className={styles.cardTop}>
                                    <div className={styles.resumeInfo}>
                                        <div className={styles.resumeIcon}>
                                            <DescriptionOutlinedIcon />
                                        </div>

                                        <div className={styles.resumeDetails}>
                                            <div className={styles.resumeName}>
                                                {item.resume_name || "Unknown Resume"}
                                            </div>

                                            <div className={styles.date}>
                                                <CalendarTodayOutlinedIcon />
                                                {formatDate(item.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SCORE */}
                                    <div
                                        className={`${styles.scoreBadge} ${styles[scoreClass]}`}
                                    >
                                        <TrendingUpIcon />

                                        <span>
                                            {score !== null
                                                ? `${score}%`
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* STATUS */}
                                {score !== null && (
                                    <div
                                        className={`${styles.matchStatus} ${styles[scoreClass]}`}
                                    >
                                        {getScoreLabel(score)}
                                    </div>
                                )}

                                {/* FEEDBACK */}
                                <div className={styles.feedbackBox}>
                                    <div className={styles.feedbackHeader}>
                                        <AutoAwesomeIcon />

                                        <span>
                                            AI Feedback
                                        </span>
                                    </div>

                                    <p>
                                        {item.feedback ||
                                            "No feedback available"}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className={styles.cardFooter}>
                                    <span>
                                        AI Resume Analysis
                                    </span>

                                    <span className={styles.statusDot}>
                                        Completed
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* NO MATCHING SEARCH RESULTS */}
            {!loader &&
             data.length > 0 &&
             filteredData.length === 0 && (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>
                        🔎
                    </div>

                    <h2>
                        No matching resumes
                    </h2>

                    <p>
                        Try changing your search or score filter.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setFilter("all");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}


            {/* EMPTY STATE */}
            {!loader && data.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <DescriptionOutlinedIcon />
                    </div>

                    <h2>
                        No analyses yet
                    </h2>

                    <p>
                        Upload your resume and analyze it against
                        a job description to see your results here.
                    </p>
                </div>
            )}


            {/* =========================
                DETAILED ANALYSIS MODAL
            ========================= */}
            {selectedResume && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelectedResume(null)}
                >
                    <div
                        className={styles.analysisModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className={styles.modalHeader}>
                            <div>
                                <div className={styles.modalEyebrow}>
                                    RESUME ANALYSIS
                                </div>

                                <h2>
                                    {selectedResume.resume_name || "Resume Analysis"}
                                </h2>
                            </div>

                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedResume(null)}
                            >
                                ×
                            </button>
                        </div>

                        {/* SCORE */}
                        <div className={styles.scoreSection}>
                            <div className={styles.scoreCircle}>
                                <span>
                                    {selectedResume.score !== null &&
                                    selectedResume.score !== undefined
                                        ? `${selectedResume.score}%`
                                        : "N/A"}
                                </span>
                            </div>

                            <div>
                                <div className={styles.scoreLabel}>
                                    Match Score
                                </div>

                                <div className={styles.scoreDescription}>
                                    {Number(selectedResume.score) >= 80
                                        ? "Excellent match"
                                        : Number(selectedResume.score) >= 60
                                        ? "Good match"
                                        : Number(selectedResume.score) >= 40
                                        ? "Partial match"
                                        : "Low match"}
                                </div>
                            </div>
                        </div>

                        {/* INFORMATION */}
                        <div className={styles.analysisInfoGrid}>
                            <div className={styles.infoBox}>
                                <span>📄 Resume</span>

                                <strong>
                                    {selectedResume.resume_name || "Unknown"}
                                </strong>
                            </div>

                            <div className={styles.infoBox}>
                                <span>📅 Analyzed</span>

                                <strong>
                                    {selectedResume.createdAt
                                        ? new Date(
                                            selectedResume.createdAt
                                        ).toLocaleDateString()
                                        : "Unknown"}
                                </strong>
                            </div>
                        </div>

                        {/* AI FEEDBACK */}
                        <div className={styles.detailSection}>
                            <div className={styles.sectionTitle}>
                                ✨ AI Feedback
                            </div>

                            <div className={styles.feedbackContent}>
                                {selectedResume.feedback ||
                                    "No feedback available."}
                            </div>
                        </div>

                        {/* JOB DESCRIPTION */}
                        <div className={styles.detailSection}>
                            <div className={styles.sectionTitle}>
                                💼 Job Description
                            </div>

                            <div className={styles.jobDescriptionContent}>
                                {selectedResume.job_desc ||
                                    selectedResume.jobDesc ||
                                    "Job description not available."}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className={styles.modalFooter}>
                            <span>
                                AI Resume Analysis
                            </span>

                            <span className={styles.completedStatus}>
                                ● Completed
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};


export default WithAuthHOC(History);