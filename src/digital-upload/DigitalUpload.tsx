import React, {useEffect} from 'react';
import conf from '../config';
import Cookies from 'js-cookie';
// @ts-ignore
import generateHash from 'random-hash';
import {useDispatch, useSelector} from 'react-redux';
import {sha256} from 'js-sha256';
import {useHistory} from "react-router-dom";
import util from '../util';
import {setCurrentCartItemNumber} from '../redux/actions/cartItemNumber';
import {useAuth} from 'oidc-react';
import {Token} from "../../types/token";
import {AxiosResponse} from "axios";
import {useTranslation} from 'react-i18next';

let dataLayer = window.dataLayer = window.dataLayer || [];

const DigitalUpload = () => {

  const {t} = useTranslation();
  document.title = t('digitalUpload.digitalUploadPageTitle');

  const token: Token = useSelector((state: any) => state.addAuthData);
  const dispatch = useDispatch();

  const auth = useAuth();
  const history = useHistory();
  var currentLocale = localStorage.getItem("i18nextLng");

  useEffect(() => {
    currentLocale = localStorage.getItem("i18nextLng");

    function getNewCart() {

      util.serviceCallWrapper(
          {
            method: 'POST',
            url: conf.urls.cartOrchestration,
            headers: token.accessToken
                ? {Authorization: `Bearer ${token.accessToken}`} : {},
          },
          (results: AxiosResponse) => {
            Cookies.set(conf.cookies.cartId, results.data.id);
            dispatch(setCurrentCartItemNumber(0));
          },
          {},
          () => {
          }
      );
    }

    function addItemToCart(item: { artNr: any; qty: any; name: any }) {
      const newItem = {
        'articleId': item.artNr,
        'quantity': item.qty ? item.qty : 1
      };

      util.serviceCallWrapper({
            method: 'POST',
            url: conf.urls.cartOrchestration + '/' + Cookies.get(conf.cookies.cartId) + '/items',
            data: newItem,
            headers: token.accessToken
                ? {Authorization: `Bearer ${token.accessToken}`} : {},
          },
          () => history.push(conf.urls.cart),
          {
            201: {
              'SUCCESS': t('digitalUpload.digitalUpload.addItem.messages.ServiceCall.201')
            },
            409: {
              'ERROR': t('digitalUpload.digitalUpload.addItem.messages.ServiceCall.409')
            },
          },
          () => {
          }
      );
    }

    function fetchCart() {
      util.serviceCallWrapper({
            method: 'GET',
            url: conf.urls.cartOrchestration + '/' + Cookies.get(conf.cookies.cartId),
            headers: token.accessToken
                ? {Authorization: `Bearer ${token.accessToken}`}
                : {},
          },
          (result: AxiosResponse) => {
            dispatch(setCurrentCartItemNumber(result.data.items.length));
            Cookies.set(conf.cookies.cartId, result.data.id)
          },
          {},
          () => {
            getNewCart()
          },
          false,
          false
      );
    }

    // Digital Order Upload
    window.orderParser = {
      // matches the element ID which will host the Parser app
      rootId: 'parser',

      // unique identifier for the user/user's
      // configuration (e.g. hash of the userId or
      // email address)
      userInfo: token.userInfo ? sha256(token?.userInfo?.email!) : generateHash(
          {length: 20}),

      locale: currentLocale,

      // cart import callback
      onCartImport: function (cartJson: { articles: any[]; }) {
        cartJson.articles.map((item) => addItemToCart(item));
      },

      // webshop version
      shopId: conf.sly_connect.api_key,
    };

    // integrate parser script
    const script = document.createElement('script');

    // TODO edit path to parser if needed
    script.src = conf.urls.digital_parser_service;
    script.async = true;

    document.body.appendChild(script);

    util.retrieveCart(auth, getNewCart, fetchCart, token.accessToken);

  }, [token, history, setCurrentCartItemNumber, auth]);

  useEffect(() => {
    document.title = conf.pageTitles.digitalUpload;
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
    dataLayer.push({event: 'gtm.load'});

  }, []);

  return (

      <div className='digitalUpload'>

        <div className='body'>
          <div id='parser'/>
        </div>

      </div>


  );

};

export default DigitalUpload;
