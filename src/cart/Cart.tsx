import React, {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import Cookies from 'js-cookie';
import conf from '../config';
import util from '../util';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {setCurrentCartItemNumber} from '../redux/actions/cartItemNumber';
import {useAuth} from 'oidc-react';
import {AxiosResponse} from "axios";
import {Token} from "../../types/token";
import {Language} from "../../types/language";
import CartItem from "./CartItem";
import {ItemDto} from "../generated/api/cartOrchestrationApi";
import {setCurrentCurrency} from "../redux/actions/currency";
import {setCurrentLanguage} from "../redux/actions/language";
import {CurrencyDto} from "../generated/api/priceOrchestrationApi";
import {Trans, useTranslation} from 'react-i18next';

export interface CartProps {
  key: number,
  currency: CurrencyDto

}

let dataLayer = window.dataLayer = window.dataLayer || [];

const Cart = ({currency}: CartProps) => {
  const language: Language = useSelector((state: any) => state.language);
  const token: Token = useSelector((state: any) => state.addAuthData);
  currency = useSelector((state: any) => state.currency);
  const dispatch = useDispatch();

  const [items, setItems] = useState<ItemDto[]>([]);
  const [cartMessage, setCartMessage] = useState(undefined);
  const [isCartOrderable, setIsCartOrderable] = useState(false)
  const [totalValue, setTotalValue] = useState(0);
  const [cartId, setCartId] = useState(Cookies.get(conf.cookies.cartId));
  const [directOrderCartURL, setDirectOrderCartURL] = useState('');
  const auth = useAuth();
  const history = useHistory();
  const {t} = useTranslation();

  document.title = t('cart.cart.cartPageTitle');

  const updateElements = useCallback(() => {
    util.serviceCallWrapper({
          method: 'GET',
          url: conf.urls.cartOrchestration + '/' + cartId,
          headers: token.accessToken
              ? {
                Authorization: `Bearer ${token.accessToken}`,
                "Accept-Language": language.code,
              }
              : {"Accept-Language": language.code},
        },
        (result: AxiosResponse) => {

          let fetchedItems: ItemDto[] = result.data.items.map((itemIn: ItemDto) => {
            return {
              key: Math.random() * 100,
              id: itemIn.id,
              articleId: itemIn.articleId,
              availability: itemIn.availability,
              name: itemIn.name,
              orderable: itemIn.orderable,
              price: itemIn.price,
              unitPrice: itemIn.unitPrice,
              quantity: itemIn.quantity,
              product: itemIn.product,
              messages: itemIn.messages,

            };
          });

          setDirectOrderCartURL(
              conf.urls.cartOrchestration + '/' + cartId + '/items');
          setItems(fetchedItems);
          setCartMessage(result.data.messages);
          setIsCartOrderable(result.data.orderable);
          setTotalValue(result.data.total);
          dispatch(setCurrentCartItemNumber(result.data.items.length));
        },
        {},
        () => {
        },
        false,
        true
    )
  }, [token, cartId, setCurrentCartItemNumber, setCurrentCurrency, setCurrentLanguage]);

  useEffect(() => {
    document.title = t('cart.cart.cartPageTitle');
    util.retrieveCart(auth, () => {
    }, updateElements, token.accessToken);

  }, [token, updateElements, auth]);

  useEffect(() => {
    document.title = conf.pageTitles.cart;
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
    dataLayer.push({event: 'gtm.load'});
  }, []);

  const handleDeleteClick = (event: MouseEvent, item: ItemDto) => {
    util.serviceCallWrapper({
          method: 'DELETE',
          url: directOrderCartURL + '/' + item.id,
          headers: token.accessToken
              ? {
                Authorization: `Bearer ${token.accessToken}`,
                "Accept-Language": language.code,
              } : {"Accept-Language": language.code},
        },
        () => updateElements(),
        {
          200: {
            'SUCCESS': t('cart.cart.removeItem.messages.successMessageText', {name: item.name})
          },
          404: {
            'ERROR': t('cart.cart.removeItem.messages.errorMessageText', {name: item.name})
          },
        },
        () => {
        },
    );
  };

  const handleDecreaseClick = (event: MouseEvent, item: ItemDto) => {
    const itemList = items.slice();

    itemList.forEach((i) => {
      if (i.id === item.id) {
        Object.assign(i, {quantity: Number(item.quantity) - 1});

        util.serviceCallWrapper({
              method: 'PATCH',
              url: directOrderCartURL,
              data: i,
              headers: token.accessToken
                  ? {
                    Authorization: `Bearer ${token.accessToken}`,
                    "Accept-Language": language.code,
                  } : {"Accept-Language": language.code},
            },
            updateElements,
            {
              200: {
                'SUCCESS': t('cart.cart.decreaseItemQuantity.messages.serviceCallresult.200', {name: item.name})
              },
              404: {
                'ERROR': t('cart.cart.decreaseItemQuantity.messages.serviceCallresult.404', {name: item.name})
              },
              422: {
                'ERROR': t('cart.cart.decreaseItemQuantity.messages.serviceCallresult.422', {name: item.name})
              },
              424: {
                'ERROR': t('cart.cart.decreaseItemQuantity.messages.serviceCallresult.424', {name: item.name})
              },
            },
            () => {
            },
        );
      }
    });
  };

  const handleIncreaseClick = (event: MouseEvent, item: ItemDto) => {
    const itemList = items.slice();

    itemList.forEach((i) => {
      if (i.id === item.id) {
        Object.assign(i, {quantity: Number(item.quantity) + 1});

        util.serviceCallWrapper({
              method: 'PATCH',
              url: directOrderCartURL,
              data: i,
              headers: token.accessToken
                  ? {
                    Authorization: `Bearer ${token.accessToken}`,
                    "Accept-Language": language.code,
                  } : {"Accept-Language": language.code},
            },
            updateElements,
            {
              200: {
                'SUCCESS': t('cart.cart.increaseItemQuantity.messages.serviceCallresult.200', {name: item.name})
              },
              404: {
                'ERROR': t('cart.cart.increaseItemQuantity.messages.serviceCallresult.404', {name: item.name})
              },
              422: {
                'ERROR': t('cart.cart.increaseItemQuantity.messages.serviceCallresult.422', {name: item.name})
              },
              424: {
                'ERROR': t('cart.cart.increaseItemQuantity.messages.serviceCallresult.424', {name: item.name})
              },
            },
            () => {
            },
        );
      }
    });
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>, item: ItemDto) => {
    const itemList = items.slice();
    setItems(itemList.map((i) => {
      if (i.id === item.id) {
        return Object.assign(i, {quantity: Number(event.target.value)});
      }
      return i;
    }));
  };

  const handleBlurEvent = (event: FocusEvent, item: ItemDto) => {
    const itemList = items.slice();

    itemList.forEach((i) => {
      if (i.id === item.id) {
        Object.assign(i, {quantity: Number(item.quantity)});

        util.serviceCallWrapper({
              method: 'PATCH',
              url: directOrderCartURL,
              data: i,
              headers: token.accessToken
                  ? {
                    Authorization: `Bearer ${token.accessToken}`,
                    "Accept-Language": language.code,
                  } : {"Accept-Language": language.code},
            },
            updateElements,
            {
              200: {
                'SUCCESS': t('cart.cart.changeItemQuantity.messages.serviceCallresult.200', {name: item.name})
              },
              404: {
                'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.404', {name: item.name})
              },
              422: {
                'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.422', {name: item.name})
              },
              424: {
                'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.424', {name: item.name})
              },
            },
            () => {
            },
        );
      }
    });
  };

  const handleEnterPressedEvent = (event: KeyboardEvent, item: ItemDto) => {
    const code = event.key || event.which;
    if (code === 13) { //13 is the enter keycode
      const itemList = items.slice();
      itemList.forEach((i) => {
        if (i.id === item.id) {

          util.serviceCallWrapper({
                method: 'PATCH',
                url: directOrderCartURL,
                data: i,
                headers: token.accessToken
                    ? {
                      Authorization: `Bearer ${token.accessToken}`,
                      "Accept-Language": language.code,
                    } : {"Accept-Language": language.code},
              },
              updateElements,
              {
                200: {
                  'SUCCESS': t('cart.cart.changeItemQuantity.messages.serviceCallresult.200', {name: item.name})
                },
                404: {
                  'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.404', {name: item.name})
                },
                422: {
                  'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.422', {name: item.name})
                },
                424: {
                  'ERROR': t('cart.cart.changeItemQuantity.messages.serviceCallresult.424', {name: item.name})
                },
              },
              () => {
              },
          );
        }
      });
    }
  };

  const redirectToCheckout = () => {
    if (token.accessToken === null) {
      auth.signIn();
    } else {
      history.push(conf.urls.checkout);
    }
  };

  const renderItem = (item: ItemDto) => {
    return (<CartItem key={item.id} item={item} currency={currency}
                      handleDelete={(e) => handleDeleteClick(e, item)}
                      handleQuantity={(e: ChangeEvent<HTMLInputElement>) => handleQuantityChange(e, item)}
                      handleDecrease={(e) => handleDecreaseClick(e, item)}
                      handleIncrease={(e) => handleIncreaseClick(e, item)}
                      handleBlur={(e) => handleBlurEvent(e, item)}
                      handleEnterPressed={(e) => handleEnterPressedEvent(e, item)}
    />);
  };

  return (

      <Container fluid className="cart">

        <div className="cartList">
          {/*page name row  */}
          <Row>
            <Col>
              {/*<h2>Place for breadcrumb</h2>*/}
              <h2>{""}</h2>
            </Col>
          </Row>

          <Container fluid>
            {/*header row*/}

            <Row className="header">
              <Col md={{span: 3, offset: 2}} className="product label">
                <Trans i18nKey={'cart.cart.cartList.tableHeader.product.label'}/>
              </Col>
              <Col md={2} className="articleNumber label">
                <Trans i18nKey={'cart.cart.cartList.tableHeader.articleNumber.label'}/>
              </Col>
              <Col md={1} className="availability label">
                <Trans i18nKey={'cart.cart.cartList.tableHeader.availability.label'}/>
              </Col>
              <Col md={1} className="price label text-right">
                <Trans i18nKey={'cart.cart.cartList.tableHeader.price.label'}/>
              </Col>
              <Col md={2} className="subtotal label text-right">
                <Trans i18nKey={'cart.cart.cartList.tableHeader.subtotal.label'}/>
              </Col>
              <Col md={1} className="delete label"></Col>
            </Row>
            {items.map((item) => renderItem(item))}
          </Container>
        </div>

        <div className="summary">
          <Row className="header">
            <Col><Trans i18nKey={'cart.cart.cartSummary.header.label'}/></Col>
          </Row>
          <Row xs={2} className="subtotal">
            <Col className="mobileLabel">
              <Trans i18nKey={'cart.cart.cartSummary.subtotal.label'}/>
            </Col>
            <Col className="mobileValue">{util.displayPrice(totalValue,
                currency)}</Col>
          </Row>
          <Row xs={2} className="shipping">
            <Col className="mobileLabel">
              <Trans i18nKey={'cart.cart.cartSummary.shipping.label'}/>
            </Col>
            <Col className="mobileValue">-</Col>
          </Row>
          <Row xs={2} className="tax">
            <Col className="mobileLabel">
              <Trans i18nKey={'cart.cart.cartSummary.tax.label'}/>
            </Col>
            <Col className="mobileValue">-</Col>
          </Row>
          <Row className="delimiter">
            <Col>
              <hr/>
            </Col>
          </Row>
          <Row xs={2} className="total">
            <Col className="mobileLabel">
              <Trans i18nKey={'cart.cart.cartSummary.total.label'}/>
            </Col>
            <Col className="mobileValue">{util.displayPrice(totalValue,
                currency)}</Col>
          </Row>
          <Row className="pay">
            <Col>
              {items.length && isCartOrderable ?
                  <Button variant="primary" type="button"
                          onClick={redirectToCheckout}>
                    <Trans i18nKey={'cart.cart.cartSummary.checkoutButton.button'}/>
                  </Button>
                  :
                  <Button variant="primary" type="button"
                          disabled
                          onClick={redirectToCheckout}>
                    <Trans i18nKey={'cart.cart.cartSummary.checkoutButton.button'}/>
                  </Button>
              }
            </Col>
          </Row>
        </div>

      </Container>
  );
};

export default Cart;