import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import type { EvaluationData, EvaluationQuestion, EvaluationResponse, DatasetFieldConfig, SubmittedEvaluation, EvaluationTemplate } from '@/types/evaluation';

// Define the shape of our state
type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type EvaluationState = {
  name: string;
  data: EvaluationData[];
  questions: EvaluationQuestion[];
  responses: Record<string, EvaluationResponse[]>;
  fieldConfig: DatasetFieldConfig[];
  instructions: string;
  mode: 'create' | 'edit' | 'answer';
  templateId?: string;
};

type AppState = {
  user: AuthUser | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authToken: string | null;
  evaluation: EvaluationState | null;
  evaluationTemplates: EvaluationTemplate[];
  submittedEvaluations: SubmittedEvaluation[];
  currentPath: string;
};

// Define actions for our reducer
type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVALUATION_DATA'; payload: { name: string; data: EvaluationData[] } }
  | { type: 'UPDATE_EVALUATION'; payload: Partial<EvaluationState> }
  | { type: 'CLEAR_EVALUATION' }
  | { type: 'SAVE_TEMPLATE'; payload: EvaluationTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: EvaluationTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'LOAD_TEMPLATE_FOR_EDIT'; payload: EvaluationTemplate }
  | { type: 'LOAD_TEMPLATE_FOR_ANSWER'; payload: EvaluationTemplate }
  | { type: 'SUBMIT_EVALUATION'; payload: SubmittedEvaluation }
  | { type: 'DELETE_EVALUATION'; payload: string }
  | { type: 'NAVIGATE'; payload: string };

// Initial state
const initialState: AppState = {
  user: null,
  theme: 'light',
  isLoading: false,
  error: null,
  isAuthenticated: false,
  authToken: null,
  evaluation: null,
  evaluationTemplates: [],
  submittedEvaluations: [],
  currentPath: '/',
};

// Create the reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        authToken: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        authToken: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authToken: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authToken: null,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_EVALUATION_DATA':
      return {
        ...state,
        evaluation: {
          name: action.payload.name,
          data: action.payload.data,
          questions: [],
          responses: {},
          fieldConfig: [],
          instructions: '',
          mode: 'create',
        },
      };
    case 'UPDATE_EVALUATION':
      return {
        ...state,
        evaluation: state.evaluation ? {
          ...state.evaluation,
          ...action.payload,
        } : null,
      };
    case 'CLEAR_EVALUATION':
      return {
        ...state,
        evaluation: null,
      };
    case 'SAVE_TEMPLATE':
      return {
        ...state,
        evaluationTemplates: [...state.evaluationTemplates, action.payload],
        evaluation: null,
      };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        evaluationTemplates: state.evaluationTemplates.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        evaluation: null,
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        evaluationTemplates: state.evaluationTemplates.filter(t => t.id !== action.payload),
      };
    case 'LOAD_TEMPLATE_FOR_EDIT':
      return {
        ...state,
        evaluation: {
          name: action.payload.name,
          data: action.payload.sampleData || [],
          questions: action.payload.questions,
          responses: {},
          fieldConfig: action.payload.fieldConfig || [],
          instructions: action.payload.instructions || '',
          mode: 'edit',
          templateId: action.payload.id,
        },
        currentPath: '/new/preview',
      };
    case 'LOAD_TEMPLATE_FOR_ANSWER':
      return {
        ...state,
        evaluation: {
          name: action.payload.name,
          data: action.payload.sampleData || [],
          questions: action.payload.questions,
          responses: {},
          fieldConfig: action.payload.fieldConfig || [],
          instructions: action.payload.instructions || '',
          mode: 'answer',
          templateId: action.payload.id,
        },
        currentPath: '/new/preview',
      };
    case 'SUBMIT_EVALUATION':
      return {
        ...state,
        submittedEvaluations: [...state.submittedEvaluations, action.payload],
        evaluation: null,
      };
    case 'DELETE_EVALUATION':
      return {
        ...state,
        submittedEvaluations: state.submittedEvaluations.filter(e => e.id !== action.payload),
      };
    case 'NAVIGATE':
      return {
        ...state,
        currentPath: action.payload,
      };
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider component
type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [savedAuth, setSavedAuth] = useState<{ user: AuthUser | null, token: string | null }>("auth-data", { user: null, token: null });
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    user: savedAuth.user,
    isAuthenticated: !!savedAuth.token,
    authToken: savedAuth.token,
  });

  // Save auth data to KV store when it changes
  useEffect(() => {
    // We need to do a deep comparison for the user object
    const userChanged = JSON.stringify(state.user) !== JSON.stringify(savedAuth.user);
    const tokenChanged = state.authToken !== savedAuth.token;

    if (userChanged || tokenChanged) {
      setSavedAuth({ user: state.user, token: state.authToken });
    }
  }, [state.user, state.authToken, savedAuth.user, savedAuth.token, setSavedAuth]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Create hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};