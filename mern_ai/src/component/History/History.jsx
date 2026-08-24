import styles from './History.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {

    if (!userInfo?._id) return;

    const fetchUserData = async () => {
      setLoader(true);

      try {
        const results = await axios.get(
          `/api/resume/get/${userInfo._id}`
        );

        console.log("History data:", results.data.resumes);

        setData(results.data.resumes || []);

      } catch (err) {
        console.log(err);
        alert("Something Went Wrong");

      } finally {
        setLoader(false);
      }
    };

    fetchUserData();

  }, [userInfo?._id]);

  return (
    <div className={styles.History}>

      <div className={styles.HistoryCardBlock}>

        {/* Loading */}
        {loader && (
          <>
            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />

            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />

            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />

            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
          </>
        )}

        {/* History */}
        {!loader && data.map((item) => {

          return (
            <div
              key={item._id}
              className={styles.HistoryCard}
            >

              <div className={styles.cardPercentage}>
                {item.score !== null && item.score !== undefined
                  ? `${item.score}%`
                  : "N/A"}
              </div>

              <p>
                Resume Name : {item.resume_name || "Unknown"}
              </p>

              <p>
                {item.feedback || "No feedback available"}
              </p>

              <p>
                Dated :{" "}
                {item.createdAt
                  ? item.createdAt.slice(0, 10)
                  : "Unknown"}
              </p>

            </div>
          );

        })}

        {/* No history */}
        {!loader && data.length === 0 && (
          <p>No resume history found.</p>
        )}

      </div>

    </div>
  );
};

export default WithAuthHOC(History);