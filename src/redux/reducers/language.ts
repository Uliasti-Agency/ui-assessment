import {LANGUAGE} from "../actionTypes";
import {setCurrentLanguageResponse} from "../actions/language";
import {Language} from "../../../types/language";

const initialState = {
  label: localStorage.getItem('i18nextLng') && localStorage.getItem('i18nextLng') === 'de' ? 'Deutsch' : 'English',
  value: localStorage.getItem('i18nextLng') && localStorage.getItem('i18nextLng') === 'de' ? 'DE' : 'EN',
  code: localStorage.getItem('i18nextLng') || 'en',
}

export default (state: Language = initialState, action: setCurrentLanguageResponse): Language => {
  switch (action.type) {
    case LANGUAGE:
      return action.payload;
    default:
      return state;
  }
}
