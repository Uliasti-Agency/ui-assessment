import React, {useCallback, useEffect, useState} from 'react';
import Header from './Header'
import Home from '../home/Home'
import Footer from './Footer'
import {Col, Container, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {useDispatch} from "react-redux";
import Cart from "../cart/Cart"
import ProductList from "../product-list/ProductList";
import ProductDetail from "../product-detail/ProductDetail";
import Checkout from "../checkout/Checkout";
import ConfirmationPage from "../checkout/Confirmation";
import DigitalUpload from "../digital-upload/DigitalUpload";
import {useAuth} from 'oidc-react';
import conf from "../config";
import TagManager from "react-gtm-module";
import {setCurrentAuthData} from "../redux/actions/authData";

const tagManagerArgs = {
  gtmId: conf.gtmContainer.id
};

const Main = () => {

  const auth = useAuth();
  const [idToken, setIdToken] = useState<string | null | undefined>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const dispatch = useDispatch();

  const checkUser = useCallback(async () => {
    if (await auth && await auth?.userData) {
      const userInfo = auth?.userData?.profile;
      const idToken = auth?.userData?.id_token;
      const accessToken = auth?.userData?.access_token;
      const isLoginPending = auth.isLoading;
      setIdToken(idToken);
      setAuthenticated(true);
      dispatch(setCurrentAuthData({
        userInfo,
        idToken,
        accessToken,
        authenticated: true,
        isLoginPending: isLoginPending
      }));
    } else {
      dispatch(setCurrentAuthData({
        userInfo: null,
        idToken: null,
        accessToken: null,
        authenticated: false,
        isLoginPending: false
      }));
    }
  }, [auth]);

  const login = () => {
    auth.signIn();
  };

  const logout = () => {
    auth.signOut();
  };

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);


  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
      <Router>
        <Container fluid className="main">
          <Row className="homeHeader">
            <Col>
              <Header login={login}
                      logout={logout}/>

            </Col>
          </Row>

          <Row className="homeBody">
            <Col>
              <Route exact path="/" component={Home}/>
              <Route path={conf.urls.cart} exact component={Cart}/>
              <Route path={conf.urls.product_list} component={ProductList}/>
              <Route path={conf.urls.product_detail} component={ProductDetail}/>
              <Route path={conf.urls.checkout} exact component={Checkout}/>
              <Route path={conf.urls.order_confirmation} exact component={ConfirmationPage}/>
              <Route path={conf.urls.digital_upload} component={DigitalUpload}/>
            </Col>
          </Row>


          <Row className="homeFooter">
            <Col>
              <Footer/>
            </Col>
          </Row>

        </Container>
      </Router>
  );
}

export default Main;