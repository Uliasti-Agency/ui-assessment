import React, {useEffect} from 'react';
import CheckoutBody from "./CheckoutBody";
import {useTranslation} from 'react-i18next';


let dataLayer = window.dataLayer = window.dataLayer || [];

const Checkout = () => {

  const {t} = useTranslation();
  document.title = t('checkout.checkoutPageTitle');

  useEffect(() => {
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
    dataLayer.push({event: 'gtm.load'});
  }, []);
  return (
      <div className=''>
        <div className="container">
          <h2 className="checkoutMainTitle"><>{t('checkout.checkoutMain.checkoutMainTitle')}</>
          </h2>
          <CheckoutBody/>
        </div>
      </div>
  );
};

export default Checkout;