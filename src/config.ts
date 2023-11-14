import {toast, ToastOptions} from 'react-toastify';
import {User} from "oidc-react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: Record<string, any>
    orderParser: any
    _env_: any;
  }
}

const conf = {
  urls: {
    cartOrchestration: window._env_.REACT_APP_CART_ORCHESTRATION_URL + "/carts",
    catalogOrchestration: window._env_.REACT_APP_CATALOG_ORCHESTRATION_URL + "/catalogs",
    cartService: window._env_.REACT_APP_CART_SERVICE_URL + "/carts",
    checkoutOrchestration: window._env_.REACT_APP_CHECKOUT_ORCHESTRATION_URL + "/orders",
    userOrchestration: window._env_.REACT_APP_USER_ORCHESTRATION_URL + "/users",
    priceOrchestration: window._env_.REACT_APP_PRICE_ORCHESTRATION_URL,
    recommendationOrchestration: window._env_.REACT_APP_RECOMMENDATION_ORCHESTRATION_URL,
    home_full: window._env_.REACT_APP_UI_MAIN_FULL_URL,
    home: window._env_.REACT_APP_UI_MAIN_URL,
    cart: window._env_.REACT_APP_UI_CART_URL,
    product_list: window._env_.REACT_APP_UI_PRODUCT_LIST_URL,
    product_detail: window._env_.REACT_APP_UI_PRODUCT_DETAIL_URL,
    checkout: window._env_.REACT_APP_UI_CHECKOUT_URL,
    order_confirmation: window._env_.REACT_APP_UI_ORDER_CONFIRMATION_URL,
    about: window._env_.REACT_APP_UI_ABOUT_URL,
    digital_upload: window._env_.REACT_APP_UI_DIGITAL_UPLOAD_URL,
    digital_parser_service: window._env_.REACT_APP_DIGITAL_UPLOAD_PARSER_SERVICE_URL
  },
  cookies: {
    cartId: 'velox_cartId',
    orderId: 'velox_orderId'
  },
  oidcConfig: {
    onSignIn: async (use: User | null) => {
      window.location.href = window._env_.REACT_APP_UI_MAIN_FULL_URL
    },
    authority: 'https://velox-nkuf8w.zitadel.cloud',
    clientId: window._env_.ZITADEL_CLIENT_ID,
    responseType: 'code',
    scope: 'openid profile email urn:zitadel:iam:org:domain:primary:velox.zitadel.cloud',
    redirectUri: window._env_.REACT_APP_UI_MAIN_FULL_URL,
    post_logout_redirect_uri: window._env_.REACT_APP_UI_MAIN_FULL_URL,
    autoSignIn: false
  },
  sly_connect: {
    api_key: window._env_.REACT_APP_SLY_CONNECT_API_KEY
  },
  messageOptionsSuccess: {
    position: toast.POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    autoClose: 10000
  } as ToastOptions,
  messageOptionsOther: {
    position: toast.POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    autoClose: false
  } as ToastOptions,
  openCheckout: function () {
    window.location.href = conf.urls.checkout;
  },
  gtmContainer: {
    id: window._env_.REACT_APP_GTM_CONTAINER_ID
  },
  pageTitles: {
    home: "Home | VELOX",
    plp: "Product List | VELOX",
    digitalUpload: "Order Upload | VELOX",
    cart: "Cart | VELOX",
    checkout: "Checkout | VELOX"
  }
};
export default conf;