import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Project3D {
  id: string;
  name: string;
  description: string;
  sketchfabUrl: string;
  modelId: string;
  isFavorite: boolean;
  createdAt: string;
}

interface ProjectsContextType {
  projects: Project3D[];
  addProject: (project: Omit<Project3D, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project3D>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getProject: (id: string) => Project3D | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = "@loba_projects";

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project3D[]>([]);

  // Load projects from storage
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setProjects(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  const saveProjects = async (updatedProjects: Project3D[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Erro ao salvar projetos:", error);
    }
  };

  const addProject = async (project: Omit<Project3D, "id" | "createdAt">) => {
    const newProject: Project3D = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    await saveProjects([...projects, newProject]);
  };

  const updateProject = async (id: string, updates: Partial<Project3D>) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    await saveProjects(updated);
  };

  const deleteProject = async (id: string) => {
    const filtered = projects.filter((p) => p.id !== id);
    await saveProjects(filtered);
  };

  const toggleFavorite = async (id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    await saveProjects(updated);
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleFavorite,
        getProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects deve ser usado dentro de ProjectsProvider");
  }
  return context;
}
