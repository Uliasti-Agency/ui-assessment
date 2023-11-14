import React, {useCallback, useEffect, useState} from "react";
import util from "../util";
import conf from "../config";
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentCurrency} from "../redux/actions/currency"
import Cookies from 'js-cookie';
import {Dropdown} from "react-bootstrap";
import {Token} from "../../types/token";
import {Language} from "../../types/language";
import {AxiosResponse} from "axios";
import {Currency} from "../../types/currency";
import {CurrencyDto} from "../generated/api/priceOrchestrationApi";

const CurrencySwitch = () => {
  const token: Token = useSelector((state: any) => state.addAuthData);
  const dispatch = useDispatch();
  const language: Language = useSelector((state: any) => state.currency);
  const currency: Currency = useSelector((state: any) => state.currency);


  const [currencies, setCurrencies] = useState<CurrencyDto[]>([])

  const updateCartCurrency = useCallback((newCurrency: CurrencyDto) => {
    util.serviceCallWrapper({
          method: 'PATCH',
          url: conf.urls.cartOrchestration + '/' + Cookies.get(conf.cookies.cartId),
          headers: token.accessToken ? {
            Authorization: `Bearer ${token.accessToken}`,
            "Accept-Language": language.code,
          } : {"Accept-Language": language.code},
          data: {
            id: Cookies.get(conf.cookies.cartId),
            currencyId: newCurrency.id
          },
        },
        () => {
          dispatch(setCurrentCurrency(newCurrency));
        },
        {},
        () => {
        },
        false,
        false
    )
  }, [token, currency]);

  const handleCurrencyChangeDropDown = (currency: CurrencyDto) => {
    currencies.forEach((availableCurrency) => {
      if (availableCurrency.id === currency.id) {
        updateCartCurrency(availableCurrency);
      }
    });
  }

  const loadCurrencies = useCallback(() => {
    util.serviceCallWrapper({
          method: 'GET',
          url: conf.urls.priceOrchestration + '/currencies',
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {},
        },
        (result: AxiosResponse) => {
          setCurrencies(result.data.content)
        },
        {},
        () => {
        },
        false
    );
  }, [token]);

  useEffect(() => {
    loadCurrencies();
  }, [token]);

  return (
      <div className="switch">
        <Dropdown className="currency">
          <Dropdown.Toggle id="dropdown-basic" className="main">
            {currency ? currency.isoCode : undefined}
          </Dropdown.Toggle>
          <Dropdown.Menu className="menu">
            {currencies.map((availableCurrency) => {
                  return <Dropdown.Item
                      className={currency ? (currency.id === availableCurrency.id ? "item selected" : "item") : ""}
                      onClick={() => handleCurrencyChangeDropDown(availableCurrency)}
                      key={availableCurrency.id}>{availableCurrency.isoCode}</Dropdown.Item>
                }
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
  );
}


export default CurrencySwitch;
