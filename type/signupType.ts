export type FormState = {
    success: boolean;
    message?: string;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};



// contoh state reduce
export type FormAction =
    | { type: 'SET_FIELD'; field: 'name' | 'email' | 'password' | 'confirmPassword'; value: string }
    | { type: 'TOGGLE_PASSWORD'; which: 'password' | 'confirm' }
    | { type: 'SET_AUTH_ERROR'; error: string | null }
    | { type: 'SET_DISPLAY_ERROR'; errors: Record<string, string[]> }
    | { type: 'RESET'; }
    | { type: 'TOGGLE_MODE' };

export type LocalState = {
    name: string
    email: string
    password: string
    confirmPassword: string
    showPassword: boolean
    showConfirm: boolean
    authError: string | null
    displayErrors: Record<string, string[]>
};

export const initialLocalState: LocalState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirm: false,
    authError: null,
    displayErrors: {},
}

export const formReducer = (
    state: LocalState,
    action: FormAction
): LocalState => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value, displayErrors: {} }
        case 'TOGGLE_PASSWORD':
            return action.which === 'password'
            ? {...state, showPassword: !state.showPassword}
            : {...state, showConfirm: !state.showConfirm}
        case 'SET_AUTH_ERROR':
            return { ...state, authError: action.error }
        case 'SET_DISPLAY_ERROR':
            return { ...state, displayErrors: action.errors }
        case 'RESET':
            return { ...initialLocalState }
        case 'TOGGLE_MODE':
            return { ...initialLocalState }
        default:
            return state
    }
}