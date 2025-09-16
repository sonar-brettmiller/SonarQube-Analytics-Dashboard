import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import SonarQubeApiService from '../services/sonarqubeApi';
import type { ReportData, ProjectSummary } from '../types/sonarqube';

interface SonarQubeContextType {
  apiService: SonarQubeApiService | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  reportData: ReportData | null;
  projects: ProjectSummary[];
  connect: (token: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const SonarQubeContext = createContext<SonarQubeContextType | undefined>(undefined);

interface SonarQubeProviderProps {
  children: ReactNode;
}

export const SonarQubeProvider: React.FC<SonarQubeProviderProps> = ({ children }) => {
  const [apiService, setApiService] = useState<SonarQubeApiService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  const connect = async (token: string) => {
    console.log('Attempting to connect to SonarQube Cloud with token:', token.substring(0, 10) + '...');
    setIsLoading(true);
    setError(null);
    
    try {
      const service = new SonarQubeApiService(token);
      
      // Test the connection by fetching projects
      console.log('Testing connection...');
      const projects = await service.getProjects(1);
      console.log('Connection successful! Found projects:', projects);
      
      setApiService(service);
      setIsConnected(true);
      
      // Load initial data
      console.log('Loading initial data...');
      await loadData(service);
      console.log('Data loaded successfully!');
      
    } catch (err) {
      console.error('Connection failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to SonarQube Cloud';
      setError(errorMessage);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (service: SonarQubeApiService) => {
    try {
      console.log('Loading report data...');
      const data = await service.getReportData();
      console.log('Report data loaded:', data);
      console.log('Projects count:', data.projects?.length || 0);
      console.log('Overall metrics:', data.overallMetrics);
      console.log('Quality gate status:', data.qualityGateStatus);
      
      // Log individual project metrics
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach((project, index) => {
          console.log(`Project ${index + 1} (${project.project.key}):`, {
            bugs: project.metrics.bugs,
            vulnerabilities: project.metrics.vulnerabilities,
            codeSmells: project.metrics.codeSmells,
            securityHotspots: project.metrics.securityHotspots,
            coverage: project.metrics.coverage
          });
        });
      }
      
      setReportData(data);
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load project data');
    }
  };

  const refreshData = async () => {
    if (!apiService) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await loadData(apiService);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Auto-connect with the provided token for demo purposes
  useEffect(() => {
    const token = '5c43d3ab6fdd3bee3e0b85e38b79044420490c17';
    console.log('Auto-connecting with token:', token.substring(0, 10) + '...');
    if (token && !isConnected && !isLoading) {
      console.log('Starting connection...');
      connect(token);
    }
  }, [isConnected, isLoading]);

  // Store token when connected
  useEffect(() => {
    if (isConnected && apiService) {
      const token = (apiService as any).api.defaults.headers.Authorization?.replace('Bearer ', '');
      if (token) {
        localStorage.setItem('sonarqube-token', token);
      }
    }
  }, [isConnected, apiService]);

  const value: SonarQubeContextType = {
    apiService,
    isConnected,
    isLoading,
    error,
    reportData,
    projects,
    connect,
    refreshData,
    clearError,
  };

  return (
    <SonarQubeContext.Provider value={value}>
      {children}
    </SonarQubeContext.Provider>
  );
};

export const useSonarQube = (): SonarQubeContextType => {
  const context = useContext(SonarQubeContext);
  if (context === undefined) {
    throw new Error('useSonarQube must be used within a SonarQubeProvider');
  }
  return context;
};
