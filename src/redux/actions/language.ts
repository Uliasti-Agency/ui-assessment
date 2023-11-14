import {LANGUAGE} from "../actionTypes";
import {Language} from "../../../types/language";

export interface setCurrentLanguageResponse {
  type: string,
  payload: Language
}

export function setCurrentLanguage(language: Language): setCurrentLanguageResponse {
  return {
    type: LANGUAGE,
    payload: language
  }
}