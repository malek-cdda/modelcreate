"use client";

import axios from "axios";

import { useState, useEffect, useCallback } from "react";

import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
const rfStyle = {
  backgroundColor: "#D0C0F7",
};

export default function Home() {
  const initialEdges = [{}];
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(initialEdges);

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setNodes]
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [setEdges]
  // );
  // const onConnect = useCallback(
  //   (connection) => setEdges((eds) => addEdge(connection, eds)),
  //   [setEdges]
  // );
  // console.log(erd.json);

  const [state, setState] = useState<any>([]);
  const [initialNode, setInitialNode] = useState<any>([]);
  const [cus, setCus] = useState<any>([]);
  useEffect(() => {
    axios.get("erd.json").then((res) => {
      Object.keys(res.data).forEach((keys, i) => {
        const fields = res.data[keys];
        // console.log(fields);
        setState((prev: any) => [...prev, fields]);
        for (let i = 0; i < fields.length; i++) {
          const refValue = fields[i]?.name;
          const newFields = fields[i].fields;

          Object.keys(newFields).forEach((key, index) => {
            let newObj = newFields[key];
            let filterObj = {
              ...newObj,
              newRef: refValue,
              // newName: fields[i]?.name,
            };
            // console.log(filterObj);
            setCus((prev: any) => [...prev, filterObj]);
          });
        }
      });
    });
  }, []);

  let i = 0;
  let d = 0;
  let val = [];
  let n = 0;
  // console.log(state);
  const initialData = state.map((items: any) => {
    // console.log(newData);
    const data = [];
    let newArr = items.map((item: any, index: number) => {
      const newData = {
        ...item,
        id: item.name,
        type: "group",
        data: { label: item.name },
        position: { x: i, y: d },
        style: {
          width: 370,
          height: 1290,
        },
      };
      n++;
      i = i + 400;
      if (n % 4 == 0) {
        d = d + 1390;
        i = 0;
      }

      return newData;
    });

    return newArr;
  });

  let k = 5;
  let c = 30;
  // console.log(cus);
  const initialDatas: any = cus.map((item: any, index: any) => {
    let newValue;
    const newData = {
      ...item,
      id: index.toString() + "a",
      newTypes: item?.type,
      data: {
        label: !item?.reference_field
          ? item?.verbose_name
          : item.reference_field,
      },
      position: { x: c, y: k },
      parentNode: item?.newRef,
      extent: "parent",
    };
    if (item?.newRef !== cus[index + 1]?.newRef) {
      k = 5;
      c = 30;
    } else {
      c = c + 10;
      k = k + 80;
    }

    // k = k + 40;
    return newData;
  });
  // console.log(initialDatas);

  let flattenedArray: any = [].concat(...initialData);
  flattenedArray.push(...initialDatas);
  // console.log(flattenedArray);
  const [f, setF] = useState<any>(flattenedArray);

  let initialEdge: any = [];

  // const onNodesChange = useCallback(
  //   (changes) => {
  //     const updatedNodes = applyNodeChanges(changes, flattenedArray);
  //     // Do something with updatedNodes, e.g., update state or perform other actions

  //     return updatedNodes;
  //   },
  //   [flattenedArray]
  // );
  // relationship edge code

  // console.log(initialDatas);
  const value = initialDatas.map((item: any, index: any) => {
    if (item.type === "ForeignKey") {
      const newItem = {
        id: item.id,
        type: item.type,
        prim_key: item.primary_key,
        ref_field: item.reference_field,
        name: item.verbose_name,
        fieldName: item?.newRef,
      };
      return newItem;
    } else if (item.primary_key === true) {
      const newItem = {
        id: item.id,
        type: item.type,
        prim_key: item.primary_key,
        ref_field: item.reference_field,
        name: item.verbose_name,
        fieldName: item?.newRef,
      };
      return newItem;
    }
  });

  const filteredValue = value.filter((items: any) => items !== undefined);
  console.log(filteredValue);
  for (let i = 0; i < filteredValue.length; i++) {
    for (let j = 0; j < filteredValue.length; j++) {
      // if (filteredValue[i].fieldName === filteredValue[j].ref_field) {
      //   const newEdge = {
      //     id: filteredValue[i].id + filteredValue[j].id,
      //     source: filteredValue[i].id,
      //     target: filteredValue[j].id,
      //   };
      //   initialEdge.push(newEdge);
      // }
      if (
        filteredValue[i].prim_key === true &&
        filteredValue[i].fieldName === filteredValue[j].ref_field
      ) {
        console.log(filteredValue[i].fieldName);
        const newEdge = {
          id: filteredValue[i].id + filteredValue[j].id,
          source: filteredValue[i].id,
          target: filteredValue[j].id,
          names: filteredValue[i].fieldName,
        };
        initialEdge.push(newEdge);
      }
    }
  }
  console.log(initialEdge);
  return (
    <main className=" ">
      <div className="h-[1000px]">
        {initialEdge.length > 0 &&
          [1].map((item: any, index: any) => (
            <div key={index} className="h-[15000px]">
              <ReactFlow
                nodes={flattenedArray}
                edges={initialEdge}
                // onNodesChange={onNodesChange}
                // onEdgesChange={onEdgesChange}
                // onConnect={onConnect}
                // fitView
                style={rfStyle}
                attributionPosition="top-right"
              >
                {/* <Background />
          <Controls /> */}
              </ReactFlow>
            </div>
          ))}
      </div>
    </main>
  );
}
