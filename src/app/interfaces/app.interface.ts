
export const GET_EMPLOYERS = '/GetEmployerData';
export const SAVE_EMPLOYERS = '/SaveEmployerData';
export const GET_API_AUTH_TOKEN = '/GenerateJwtToken';;

export interface IPostAPIRes {
  statusCode?: number;
  statusMessage?: string;
  campaignUserValidation?: any[];
}
export interface IMultiFieldModel {
  backdrop: boolean;
  ignoreBackdropClick: boolean;
  class: string;
  modalClass?: string;
  initialState: MultiFieldInitialState;
}

export interface MultiFieldInitialState {
  modelType?: string;
  trueButtonText?: string;
  isIframeVisible?: boolean;
  content?: string;
  title?: string;
  url?: string;
}

export interface DataTableColumn {
  key: string;
  title: string;
  width: number;
  unit?: string;
  isBold?: boolean;
  isGrey?: boolean;
  tooltipInfo?: string
}

export interface DataTableDetail {
  id: string;
  searchTotalCount: number;
  listName: string;
  placeholder?: string;
}


export interface ToastEvent {
  message: string;
  type: string;
}

export interface IHttpErrorResponse {
  status: string;
  message: string;
}

export interface IAuthCred {
  userName: string;
  password: string;
}

export interface IApiAuthTokenRes extends IPostAPIRes {
  token: string;
}
