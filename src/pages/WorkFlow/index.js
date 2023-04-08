import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import './style.css'
const WorkFlow = () => {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    axios
    .get("https://64307b10d4518cfb0e50e555.mockapi.io/workflow")
    .then((response) => {
      setWorkflows(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);
  return (
    <div className="workflow">
      <div className="workflow-head">Workflows</div>
      <div className="workflow-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Input Type</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => (
              <tr key={workflow.id}>
                <td>
                  <Link to={`/workflows/modules/?name=${workflow.name}`}>
                    {workflow.name}
                  </Link>
                </td>
                <td style={{textTransform: "uppercase"}}>{workflow.input_type}</td>
                <td>{workflow.createdAt.slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkFlow;
