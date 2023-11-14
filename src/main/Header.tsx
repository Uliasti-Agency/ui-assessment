import React, {useCallback, useEffect, useState} from 'react';
import {Button, Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import conf from '../config';
import {NavLink} from 'react-router-dom';
import Cookies from 'js-cookie';
import {setCurrentCartItemNumber} from '../redux/actions/cartItemNumber';
import util from '../util';
import {useAuth} from 'oidc-react';
import CurrencySwitch from "./CurrencySwitch";
import {setCurrentCurrency} from "../redux/actions/currency";
import LanguageSwitch from "./LanguageSwitch";
import {Token} from "../../types/token";
import {AxiosResponse} from "axios";
import {CartDto} from "../generated/api/cartOrchestrationApi";
import {useTranslation} from 'react-i18next';

export interface HeaderProps {
  login: () => void,
  logout: () => void,
}

const Header = ({login, logout}: HeaderProps) => {
  const dispatch = useDispatch();
  const token: Token = useSelector((state: any) => state.addAuthData);
  const cartItemNumber: number = useSelector((state: any) => state.getCartItemNumber.cartItemNumber);

  const auth = useAuth();
  const [expanded, setExpanded] = useState(false);
  const {t} = useTranslation();

  const getNewCart = useCallback((defaultCurrency: CartDto) => {
    util.serviceCallWrapper(
        {
          method: 'POST',
          url: conf.urls.cartOrchestration,
          data: {currencyId: defaultCurrency.id},
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {},
        },
        (result: AxiosResponse) => {
          Cookies.set(conf.cookies.cartId, result.data.id);
          dispatch(setCurrentCartItemNumber(0));
        },
        {},
        () => {
        },
    );
  }, [token, setCurrentCartItemNumber]);

  const loadDefaultCurrency = useCallback(() => {
    util.serviceCallWrapper(
        {
          method: 'GET',
          url: conf.urls.priceOrchestration + '/currencies',
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {},
        },
        (result: AxiosResponse) => {
          dispatch(setCurrentCurrency(result.data.content[0]));
          getNewCart(result.data.content[0]);
        },
        {},
        () => {
        },
        false
    );
  }, [token, setCurrentCurrency, getNewCart]);

  const loadCurrency = useCallback((currencyId: string) => {
    util.serviceCallWrapper(
        {
          method: 'GET',
          url: conf.urls.priceOrchestration + '/currencies/' + currencyId,
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {},
        },
        (result: AxiosResponse) => {
          dispatch(setCurrentCurrency(result.data));
        },
        {},
        () => {
        },
        false
    );
  }, [token, setCurrentCurrency]);

  const fetchCart = useCallback(() => {
    util.serviceCallWrapper({
          method: 'GET',
          url: conf.urls.cartOrchestration + '/' + Cookies.get(conf.cookies.cartId),
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`}
              : {},
        },
        (result: AxiosResponse) => {
          dispatch(setCurrentCartItemNumber(result.data.items.length));
          Cookies.set(conf.cookies.cartId, result.data.id);
          loadCurrency(result.data.currencyId);
        },
        {},
        () => {
          loadDefaultCurrency();
        },
        false,
        false,
    );
  }, [token, setCurrentCartItemNumber, loadCurrency, loadDefaultCurrency]);

  useEffect(() => {
    util.retrieveCart(auth, loadDefaultCurrency, fetchCart, token.accessToken);
  }, [token, loadDefaultCurrency, fetchCart, auth]);

  // @ts-ignore
  return (
      <Container fluid className="fluidContainer">

        <Navbar expanded={expanded} fixed="top" expand="md" className="header">
          <Navbar.Brand className="brand">
            <NavLink className="logo" to={conf.urls.home}>
              <img src="/assets/VeloxLogo-MidnightBlue.png"
                   style={{width: 218, height: 57}}
                   alt='Velox logo'/>
            </NavLink>
            <NavLink className="logoMobile" to={conf.urls.home}>
              <img src="/assets/VeloxLogo-Mobile.svg"
                   alt='Velox logo mobile'/>
            </NavLink>
            <Navbar.Toggle onClick={() => setExpanded(expanded ? false : true)}
                           aria-controls="basic-navbar-nav"/>
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav" className="links">
            <Nav className="flex-md-row flex-column">
              <NavLink className="nav-link" exact activeClassName="active"
                       onClick={() => setExpanded(false)} to={conf.urls.home}>
                <>{t('main.header.navbar.home.label')}</>
              </NavLink>
              <NavLink className="nav-link" exact activeClassName="active"
                       onClick={() => setExpanded(false)} to={conf.urls.product_list}>
                <>{t('main.header.navbar.products.label')}</>
              </NavLink>
              <NavLink className="nav-link" exact activeClassName="active"
                       onClick={() => setExpanded(false)} to={conf.urls.digital_upload}>
                <>{t('main.header.navbar.orderUpload.label')}</>
              </NavLink>
              <a className="nav-link" href={conf.urls.about} target="_blank"
                 onClick={() => setExpanded(false)} rel="noopener noreferrer">
                <>{t('main.header.navbar.about.label')}</>
              </a>
            </Nav>
            <Nav className="nav language">
              <LanguageSwitch/>
            </Nav>
            <Nav className="nav currency">
              <CurrencySwitch/>
            </Nav>
            <Nav className="login nav">
              {
                !token.isLoginPending ? (
                        token.authenticated ?
                            (
                                <NavDropdown title={token?.userInfo?.email}
                                             id="basic-nav-dropdown">
                                  <NavDropdown.Item
                                      onClick={logout}><>{t('main.header.navDropdown.logout.label')}</>
                                  </NavDropdown.Item>
                                </NavDropdown>
                            )
                            :
                            <Button variant="primary" className="button"
                                    onClick={login}><>{t('main.header.navDropdown.login.label')}</>
                            </Button>
                    )
                    :
                    <Navbar.Text>
                      <img src="/assets/spinner.gif"
                           style={{width: 35, height: 35}}
                           alt=''/>
                    </Navbar.Text>
              }
            </Nav>
          </Navbar.Collapse>

          <Nav className="cartIcon">
            <NavLink to={conf.urls.cart}>
              <img src="/assets/cartIcon.svg"
                   className="icon"
                   alt=''/>
              <span className="itemCartNumber badge badge-pill badge-success">
                  {cartItemNumber}
                </span>
            </NavLink>
          </Nav>

        </Navbar>
      </Container>
  );
};
export default Header;