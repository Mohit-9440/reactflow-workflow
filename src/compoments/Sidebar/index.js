import React from 'react';
import { useState, useEffect } from "react";
import './style.css'
import { Pagination } from '@mui/material';

const Sidebar = () => {
  const onDragStart = (event, nodeName, node_input_type, node_output_type) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeName, node_input_type, node_output_type}));
    event.dataTransfer.effectAllowed = 'move';
  };

  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=${currentPage}&limit=5`)
      .then(response => response.json())
      .then(data => {
        setModules(data);
        setTotalPages(Math.ceil(data.total / 5));
      })
      .catch(error => console.error(error));
  }, [currentPage]);

 const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className='sidebar'>
        <div className='sidebar_head'><h2>Modules</h2></div>
    
        <aside className='sidebar_bottom'>
      <div>

          {modules.map(module => (
            <div key={module.id} className="dndnode" onDragStart={(event) => onDragStart(event, module.name, module.input_type, module.output_type)} draggable>
                <div className='dndnode_data'>
                  <div className='dndnode_input_type'>{module.input_type}</div>
                  <div className='dndnode_name'>{module.name}</div>
                  <div className='dndnode_output_type'>{module.output_type}</div>
                </div>  
            </div>
          ))}
      </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <Pagination 
            count={20} //totalPages
            siblingCount={0}  
            page={currentPage} onChange={handlePageChange} />
          </div>
        </aside>
    </div>
  );
};
export default Sidebar;