import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import "../styles/contest.css";
import { AuthContext } from "../contexts/AuthContext";

const Contests = () => {
  const [ongoing, setOngoing] = useState([]);
  const [past, setPast] = useState([]);
  const [mycontests, setMycontests] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const { isAdmin } = useContext(AuthContext);


  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const contestResponse = await axios.get('http://localhost:8080/contests', { withCredentials: true });
        const myContestResponse = await axios.get('http://localhost:8080/contests/mycontests', { withCredentials: true });

        const contests = contestResponse.data.reverse();
        const myContests = myContestResponse.data.reverse();

        const now = moment();

        const ongoingContests = contests.filter((contest) =>
          moment(contest.end_time).isAfter(now)
        );
        const pastContests = contests.filter((contest) =>
          moment(contest.end_time).isBefore(now)
        );
        // ongoingContests.reverse();
        setOngoing(ongoingContests);
        setPast(pastContests);
        setMycontests(myContests);

        updateTimers(ongoingContests);
        intervalId = setInterval(() => updateTimers(ongoingContests), 1000);

      } catch (error) {
        console.error("Error fetching contests data:", error);
      }
    };

    fetchData();

    return () => clearInterval(intervalId);

  }, []);

  const updateTimers = (contests) => {
    const newTimeLeft = {};
    const now = moment();

    contests.map((contest, index) => {
      const start_time = moment(contest.start_time);
      const end_time = moment(contest.end_time);

      if (now.isBefore(start_time)) {
        // Contest has not started
        const duration = moment.duration(start_time.diff(now));
        newTimeLeft[index] = {
          status: "starts in",
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        };
      } else if (now.isBefore(end_time)) {
        // Contest is ongoing
        const duration = moment.duration(end_time.diff(now));
        newTimeLeft[index] = {
          status: "ends in",
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        };
      } else {
        newTimeLeft[contest.id] = null; // Contest has ended
      }
    });

    setTimeLeft(newTimeLeft);
  };


  return (
    <div className="contests-wrapper">
      <div className="contest-header">
        <div className="heading-wrapper">
          <h2 className="heading">Ongoing Contests</h2>
        </div>
        {isAdmin && (
          <div className="add-contest">
            <Link to={'/addcontest'}>
              <i className='bx bx-pencil bx-sm'></i>
              <span className='para'>Add a contest</span>
            </Link>
          </div>
        )}
      </div>
      <div className="card-container">
        {ongoing.map((contest, index) => (
          
          <Link
            to={`/contests/${contest._id}`}
            key={index}
            className="card"

          ><div className="card-heading">
            <h3>{contest.title}</h3>
            {(timeLeft[index].status=="ends in")&&(
              <span className="active">Active</span>
            )
            }
            </div>
            <p>Start Time: {moment(contest.start_time).format("LLL")}</p>
            <p>End Time: {moment(contest.end_time).format("LLL")}</p>
            <p>
              {timeLeft[index] ? (
                <span>
                  Contest {timeLeft[index].status}{" "}
                  {`${timeLeft[index].days}d ${timeLeft[index].hours
                    }h ${timeLeft[index].minutes}m ${timeLeft[index].seconds
                    }s`}
                </span>
              ) : (
                <span>Contest has ended</span>
              )}
            </p>
          </Link>
        ))}
      </div>
      <div className="table-container">
        <div className="past-contests">
          <h2 className="heading">Past contests</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {past.map((contest, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/contests/${contest._id}`}
                      key={index}
                      className=""
                    >
                      {contest.title}
                    </Link>
                  </td>
                  <td>{moment(contest.start_time).format("LLL")}</td>
                  <td>{moment(contest.end_time).format("LLL")}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        {mycontests.length > 0 && (
          <div className="my-contests">
            <h2 className="heading">My contests</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {mycontests.map((contest, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/contests/${contest._id}`}
                        key={index}
                        className=""
                      >
                        {contest.title}
                      </Link></td>
                    <td>{moment(contest.start_time).format("LLL")}</td>
                    <td>{moment(contest.end_time).format("LLL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
