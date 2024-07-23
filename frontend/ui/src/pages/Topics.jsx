import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/topics.css'

const Topics = () => {
  const topics = ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'];
  return (
    <div className="home">
      <h1 className='heading'>Practice topic wise problems </h1>
      {/* <div className='info'>Enhance your skills, expand your knowledge and prepare for technical interviews.</div> */}
      <div className="topics-container">

        <div className="sub-topic">
          <Link className="" to={`/topics/array`}  >
            <div className=" topic topic-0"></div>
          </Link>
          <div className="topic-name">{topics[0]}</div>
        </div>

        <div className="sub-topic">
          <Link className="" to={`/topics/linkedlist`}  >
            <div className=" topic topic-1"></div>
          </Link>
          <div className="topic-name">{topics[1]}</div>
        </div>

        <div className="sub-topic">
          <Link className="" to={`/topics/stack`}  >
            <div className=" topic topic-2"></div>
          </Link>
          <div className="topic-name">{topics[2]}</div>
        </div>

        <div className="sub-topic">
          <Link className="" to={`/topics/queue`}  >
            <div className=" topic topic-3"></div>
          </Link>
          <div className="topic-name">{topics[3]}</div>
        </div>

        <div className="sub-topic">
          <Link className="" to={`/topics/tree`}  >
            <div className=" topic topic-4"></div>
          </Link>
          <div className="topic-name">{topics[4]}</div>
        </div>

        <div className="sub-topic">
          <Link to={`/topics/graph`}  >
            <div className=" topic topic-5"></div>
          </Link>
          <div className="topic-name">{topics[5]}</div>
        </div>

      </div>
    </div>
  );
};


export default Topics;