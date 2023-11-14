import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown} from "react-bootstrap";
import {setCurrentLanguage} from "../redux/actions/language";
import "../i18n/i18n";
import i18n from "i18next";
import {Language} from "../../types/language";
import {useLocation} from 'react-router-dom'

const LanguageSwitch = () => {
  const language: Language = useSelector((state: any) => state.language);
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLanguageChange = (language: Language) => {
    dispatch(setCurrentLanguage(language))
    i18n.changeLanguage(language.code);

    // @To do When "Order Upload" tab is selected  and we switch language, then direct upload widget does not change language, until we reload the page with new locale/currentLocale
    // see ticket https://gitlab.com/velox-shop/ui/-/issues/126
    if (location.pathname === '/digital-upload') {
      window.location.reload();
    }
  }

  useEffect(() => {
    i18n.changeLanguage(language.code);
  }, [language]);
  return (
      <div className="switch">
        <Dropdown className="language">
          <Dropdown.Toggle id="dropdown-basic" className="main">
            {language ? language.value : ""}
          </Dropdown.Toggle>
          <Dropdown.Menu className="menu">
            <Dropdown.Item
                className={language ? (language.code === "en" ? "item selected" : "item") : ""}
                onClick={() => handleLanguageChange({label: "English", value: "EN", code: "en"})}
                key={Math.random()}>English</Dropdown.Item>
            <Dropdown.Item
                className={language ? (language.code === "de" ? "item selected" : "item") : ""}
                onClick={() => handleLanguageChange({label: "Deutsch", value: "DE", code: "de"})}
                key={Math.random()}>Deutsch</Dropdown.Item>
            <Dropdown.Item
                className={language ? (language.code === "es" ? "item selected" : "item") : ""}
                onClick={() => handleLanguageChange({label: "Espanola", value: "ES", code: "es"})}
                key={Math.random()}>Española</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
  );
}


export default LanguageSwitch;
