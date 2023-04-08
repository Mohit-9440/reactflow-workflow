import React, { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  
} from 'reactflow';
import Sidebar from '../../compoments/Sidebar';
import './index.css';



const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 
      <div className='dndnode_data flow_node'>
        <div className='dndnode_input_type'><ArrowCircleRightOutlinedIcon sx={{ width: '15px', height: '15px' }} /></div>
        <div className='dndnode_name'>Input</div>
        <div className='dndnode_output_type'>A</div>
      </div>
      },
    style:{height: "auto"},
    position: { x: 250, y: -50 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DesignWorkFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [selectedNode, setSelectedNode] = useState()
  const [selectedEdge, setSelectedEdge] = useState()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowRef = useRef(null);
  console.log({nodes, edges})


  const handleKeyDown = (event) => {
    if (event.keyCode === 46 || event.keyCode === 8) {
      if (selectedNode.length > 0) {
        setNodes((els) => els.filter((el) => el.id !== selectedNode[0].id))
      } else if (selectedEdge.length > 0) {
        // setEdges((els) => els.filter((el) => el.id !== selectedEdge[0].id)) 
      }
    }
  };

  
  function handleSelectionChange(elements) {
    console.log(elements)
    setSelectedNode(elements?.nodes)
    setSelectedEdge(elements?.edges)
  }
  
  const onConnect = useCallback((params) => {
    console.log({onChange : params})
    setEdges((eds) => addEdge(params, eds))
    setNodes((nodes) => {
      // Find the target node for the new edge
      const targetNode = nodes.find(node => node.id === params.target);
  
      if (targetNode) {
        // Update the target node's style to include a black border
        const updatedNode = {
          ...targetNode,
          style: {
            border: '1px solid rgb(101, 188, 231)',
            borderRadius: '5px',
            // padding: '10px',
          },
        };
  
        // Create a new array of nodes with the updated target node
        return nodes.map(node => (node.id === updatedNode.id ? updatedNode : node));
      }
  
      return nodes;
    });
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const { nodeName, node_input_type, node_output_type } = JSON.parse(type);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: (
          <div className='dndnode_data flow_node'>
            <div className='dndnode_input_type'>{node_input_type}</div>
            <div className='dndnode_name'>{nodeName}</div>
            <div className='dndnode_output_type'>{node_output_type}</div>
        </div>
        ) },
        style: { border: '1px solid red' } 
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // Check if a node has any edges connected to a source and set its border color accordingly
  nodes.forEach((node) => {
    const hasSourceEdge = edges.some((edge) => edge.target === node.id);
    if (!hasSourceEdge) {
      node.borderColor = 'red';
    } else {
      node.borderColor = 'rgb(101, 188, 231)';
    }
  });
  const onNodeDragStop = (event, node) => {
    console.log(node)
    const hasSource = edges.some((edge) => edge.target === node.id);
    const updatedNode = { ...node };
    updatedNode.style = { 
      border: (hasSource || node?.type === 'input') ? '1px solid rgb(101, 188, 231)' : '1px solid red',
      fontSize: '14px !important',
      ".dndnode_input_type" : {borderColor: 'red'}
     };
    setNodes((nodes) => nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workflowName = queryParams.get('name');

  
  return (
    <div className="dndflow">
      <ReactFlowProvider>
      <div className='header'>Workflow Name : {workflowName}</div>
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%'
          }}
        >

          <Sidebar />
          <div style={{width: '75%'}} className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={handleSelectionChange}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={onNodeDragStop}
              fitView
              onKeyDown={handleKeyDown}
              onLoad={(_reactFlowInstance) => (reactFlowRef.current = _reactFlowInstance)}
              deleteKeyCode={46}
            >
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DesignWorkFlow;
