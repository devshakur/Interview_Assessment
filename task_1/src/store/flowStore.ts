import { create } from "zustand";
import { Node, Edge } from "reactflow";

interface Model {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    defaultValue: string;
    validation: string;
    mapping?: string;
  }[];
}

interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: {
    authRequired: boolean;
    routes: string[];
    canCreateUsers?: boolean;
    canEditUsers?: boolean;
    canDeleteUsers?: boolean;
    canManageRoles?: boolean;
  };
}

interface Route {
  id: string;
  name: string;
  method: string;
  url: string;
  flowData?: {
    nodes: any[];
    edges: any[];
  };
}

interface Settings {
  globalKey: string;
  databaseType: string;
  authType: string;
  timezone: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  models: Model[];
  roles: Role[];
  routes: Route[];
  settings: Settings;
  defaultTablesShown: boolean;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setSelectedNode: (node: Node | null) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  addModel: (model: Model) => void;
  updateModel: (model: Model) => void;
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (roleId: string) => void;
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (routeId: string) => void;
  updateSettings: (settings: Settings) => void;
  setDefaultTablesShown: (shown: boolean) => void;
  updateNode: (nodeId: string, newData: any) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  models: [],
  roles: [],
  routes: [],
  settings: {
    globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    databaseType: "mysql",
    authType: "session",
    timezone: "UTC",
    dbHost: "localhost",
    dbPort: "3306", // normal MySQL port
    dbUser: "root",
    dbPassword: "root",
    dbName: `database_${new Date().toISOString().split("T")[0]}`, // today's date
  },
  defaultTablesShown: false,
  setNodes: (nodes) =>
    set((state) => ({
      nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
    })),
  setEdges: (edges) =>
    set((state) => ({
      edges: typeof edges === "function" ? edges(state.edges) : edges,
    })),
  setSelectedNode: (node) => set({ selectedNode: node }),
  updateNodeData: (nodeId, newData) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    })),
  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),
  updateModel: (model) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === model.id ? model : m)),
    })),
  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, role],
    })),
  updateRole: (role) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === role.id ? role : r)),
    })),
  deleteRole: (roleId) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== roleId),
    })),
  addRoute: (route) =>
    set((state) => ({
      routes: [...state.routes, route],
    })),
  updateRoute: (route) =>
    set((state) => ({
      routes: state.routes.map((r) => (r.id === route.id ? route : r)),
    })),
  deleteRoute: (routeId) =>
    set((state) => ({
      routes: state.routes.filter((r) => r.id !== routeId),
    })),
  updateSettings: (settings) => set({ settings }),
  setDefaultTablesShown: (shown) => set({ defaultTablesShown: shown }),
  updateNode: (nodeId: string, newData: any) => {
    console.log("Updating node in store:", nodeId, newData);
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      ),
    }));
  },
}));
// import React, { createContext, useContext, useState } from "react";
// import { Node, Edge } from "reactflow";

// const FlowContext = createContext(null);

// export const FlowProvider = ({ children }) => {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [models, setModels] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [defaultTablesShown, setDefaultTablesShown] = useState(false);
//   const [settings, setSettings] = useState({
//     globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//     databaseType: "mysql",
//     authType: "session",
//     timezone: "UTC",
//     dbHost: "localhost",
//     dbPort: "3306",
//     dbUser: "root",
//     dbPassword: "root",
//     dbName: `database_${new Date().toISOString().split("T")[0]}`,
//   });

//   const updateNodeData = (nodeId, newData) => {
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
//       )
//     );
//   };

//   const addModel = (model) => setModels((prev) => [...prev, model]);
//   const updateModel = (model) =>
//     setModels((prev) => prev.map((m) => (m.id === model.id ? model : m)));

//   const addRole = (role) => setRoles((prev) => [...prev, role]);
//   const updateRole = (role) =>
//     setRoles((prev) => prev.map((r) => (r.id === role.id ? role : r)));
//   const deleteRole = (roleId) => setRoles((prev) => prev.filter((r) => r.id !== roleId));

//   const addRoute = (route) => setRoutes((prev) => [...prev, route]);
//   const updateRoute = (route) =>
//     setRoutes((prev) => prev.map((r) => (r.id === route.id ? route : r)));
//   const deleteRoute = (routeId) => setRoutes((prev) => prev.filter((r) => r.id !== routeId));

//   return (
//     <FlowContext.Provider
//       value={{
//         nodes,
//         setNodes,
//         edges,
//         setEdges,
//         selectedNode,
//         setSelectedNode,
//         models,
//         addModel,
//         updateModel,
//         roles,
//         addRole,
//         updateRole,
//         deleteRole,
//         routes,
//         addRoute,
//         updateRoute,
//         deleteRoute,
//         settings,
//         setSettings,
//         defaultTablesShown,
//         setDefaultTablesShown,
//         updateNodeData,
//       }}
//     >
//       {children}
//     </FlowContext.Provider>
//   );
// };

// export const useFlowContext = () => {
//   const context = useContext(FlowContext);
//   if (!context) {
//     throw new Error("useFlowContext must be used within a FlowProvider");
//   }
//   return context;
// };
