import React, {useCallback, useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import conf from '../config';
import {Button, Col, Container, OverlayTrigger, Popover, Row, Spinner,} from 'react-bootstrap';
import CheckoutItem from './CheckoutItem';
import UserAddress from './UserAddress';
import {useDispatch, useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import util from '../util';
import {setCurrentCartItemNumber} from "../redux/actions/cartItemNumber";
import {setCurrentOrderNumber} from "../redux/actions/orderNumber";
import {useHistory} from "react-router-dom";
import {sha256} from "js-sha256";
import {Trans, useTranslation} from 'react-i18next';
import {Currency} from "../../types/currency";
import {Token} from "../../types/token";
import {OrderDto, OrderEntryDto, UserDto} from "../generated/api/checkoutOrchestrationApi";
import {CartDto, ProductEntity} from "../generated/api/cartOrchestrationApi";

let dataLayer = window.dataLayer = window.dataLayer || [];

export interface OrderEntryDtoExtended extends OrderEntryDto {
  imageURL: string | undefined,
}

const CheckoutBody = () => {
  const currency: Currency = useSelector((state: any) => state.currency);
  const token: Token = useSelector((state: any) => state.addAuthData);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [orderDraft, setOrderDraft] = useState<OrderEntryDtoExtended[]>([]);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [editShipmentAddress, setEditShipmentAddress] = useState<boolean | undefined>(false);
  const history = useHistory();
  const [ETag, setETag] = useState('');
  const [cartDto, setCartDto] = useState<CartDto | undefined>(undefined);
  const [orderDto, setOrderDto] = useState<OrderDto | null>(null);
  const [disabledButton, setDisabledButton] = useState(false);
  const [billingUser, setBillingUser] = useState<UserDto>({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    addressDto: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      city: '',
      zipCode: '',
      poBox: '',
      country: '',
    },
  });
  const [shippingUser, setShippingUser] = useState<UserDto>({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    addressDto: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      city: '',
      zipCode: '',
      poBox: '',
      country: '',
    },
  });

  const fetchUser = useCallback(async () => {
    //fetch the user
    let cartData: CartDto | undefined = undefined;
    axios({
      method: 'GET',
      url: conf.urls.userOrchestration + '/' + token?.userInfo?.sub,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }).then((results) => {

      if (results.status === 200) {
        setIsUserCreated(true);
      }
      return results.data;
    }, () => {
    }).then(data => {
      if (data !== undefined) {
        setBillingUser(JSON.parse(JSON.stringify(data)));
        setShippingUser(JSON.parse(JSON.stringify(data)));
      }
    }).then(() => {
      //fetch the cart-content for order to be created
      axios({
        method: 'GET',
        url: conf.urls.cartOrchestration + '/' + Cookies.get(
            conf.cookies.cartId),
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }).then(results => {
        cartData = results.data;
        setCartDto(cartData);
        return results.data;
      }).then(() => {
        //fetch the checkout preview and orderDto from checkout_orchestration
        axios({
          method: 'POST',
          url: conf.urls.checkoutOrchestration,
          data: cartData,
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'content-type': "application/json;charset=UTF-8"
          },
        }).then(results => {
          setETag(results.headers.etag);
          dispatch(setCurrentOrderNumber(results.data.orderNum))
          Cookies.set(conf.cookies.orderId, results.data.id);
          return results.data;
        }).then(data => {
          let items: OrderEntryDtoExtended[] = data.entries.map((itemIn: OrderEntryDto, index: number) => {
            var imageURL: string | undefined = "";
            var product: ProductEntity | undefined = cartData && cartData?.items?.[index]?.product;
            if (product) {
              var isImageURLPresent = cartData && cartData?.items?.[index]?.product?.images?.[0]?.url;
              if (isImageURLPresent) {
                imageURL = cartData?.items?.[index]?.product?.images?.[0]?.url
              }
            }

            return {
              key: Math.random() * 100,
              articleId: itemIn.articleId,
              articleName: itemIn.articleName,
              availability: itemIn.availability,
              quantity: itemIn.quantity,
              unitPrice: itemIn.unitPrice,
              price: itemIn.price,
              imageURL: imageURL,
            };
          });
          setOrderDraft(items);
          setOrderDto(data);
        }).catch(function (error) {
        })
      })
    })
  }, [token, setCurrentOrderNumber]);
  const handleCreateOrUpdateUser = (async () => {
        let user = billingUser;


        if (isUserCreated === false) {
          user.id = token?.userInfo?.sub!;
          user.firstName = billingUser.addressDto.firstName;
          user.lastName = billingUser.addressDto.lastName;
          user.email = token?.userInfo?.email!;

          //Create the user
          util.serviceCallWrapper(
              {
                method: 'POST',
                url: conf.urls.userOrchestration,
                data: user,
                headers: {Authorization: `Bearer ${token.accessToken}`}
              },
              (result: AxiosResponse) => {
                if (result.status === 200) {
                  setIsUserCreated(true);
                }
              },
              {
                201: {
                  'SUCCESS': 'User address is added!'
                },
                409: {
                  'ERROR': 'User with given username: ' + user.id
                      + ' already exists!'
                },
                422: {
                  'ERROR': 'Something went wrong. Please try again!'
                }
              },
              () => {
              },
          );
        } else {
          //Update the user
          util.serviceCallWrapper({
                method: 'PATCH',
                url: conf.urls.userOrchestration + '/' + user.id,
                data: user,
                headers: {Authorization: `Bearer ${token.accessToken}`}
              },
              () => {
              },
              {},
              () => {
              },
          );
        }
      }
  )
  const popoverUnsuccess = (
      <Popover id="popover-main">
        <Popover.Header as="h3" className="popover-basic">
          <Trans i18nKey={'checkout.checkoutBody.popoverUnsuccess.title'}/>
        </Popover.Header>
        <Popover.Body className="popover-basic">
          <Trans i18nKey={'checkout.checkoutBody.popoverUnsuccess.content'}/>
        </Popover.Body>
      </Popover>
  );

  const popoverSuccess = (
      <Popover id="popover-main">
        <Popover.Header as="h3" className="popover-basic">
          <Trans i18nKey={'checkout.checkoutBody.popoverSuccess.title'}/>
        </Popover.Header>
        <Popover.Body className="popover-basic">
          <Trans i18nKey={'checkout.checkoutBody.popoverSuccess.content'}/>
        </Popover.Body>
      </Popover>
  );

  const CheckoutButton = () => (
      checkoutSuccessful ?
          <OverlayTrigger trigger={['hover', 'hover']} placement="right"
                          overlay={popoverSuccess}>
              <span className='d-inline-block'>
              <Button variant="primary" onClick={confirmOrder} className="confirmOrder">
                  <Trans i18nKey={'checkout.checkoutBody.checkoutButton.button'}/>
              </Button></span>
          </OverlayTrigger> :
          <OverlayTrigger trigger={["click", "click"]} placement="right"
                          overlay={popoverUnsuccess}>
            {disabledButton ? <Button variant="success" disabled
                                      onClick={confirmOrder}>
                  <Trans i18nKey={'checkout.checkoutBody.checkoutButton.button'}/>
                </Button>
                : <Button variant="primary" className="orderNow" onClick={confirmOrder}>
                  <Trans i18nKey={'checkout.checkoutBody.checkoutButton.button'}/>
                </Button>}
          </OverlayTrigger>
  );

  useEffect(() => {
    if (token.userInfo) {
      fetchUser();
      setIsLoginPending(true);
    }
  }, [token, fetchUser, currency]);

  const getNewCart = () => {
    util.serviceCallWrapper(
        {
          method: 'POST',
          url: conf.urls.cartOrchestration,
          data: {currencyId: currency.id},
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
        false
    );
  };

  const toggleShipmentAddress = () => {
    setEditShipmentAddress(!editShipmentAddress);
  }

  const confirmOrder = () => {
    let orderDtoUpdated = orderDto!;
    orderDtoUpdated.orderStatus = "ORDERED";
    setDisabledButton(true);
    if (!editShipmentAddress) {
      orderDtoUpdated.shippingAddress = orderDtoUpdated.billingAddress;
    }

    util.serviceCallWrapper({
          method: 'PATCH',
          url: conf.urls.checkoutOrchestration + '/' + orderDtoUpdated.id,
          data: orderDtoUpdated,
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'If-Match': ETag,
          },
        },
        (result: AxiosResponse) => {
          if (result.status === 200) {
            setCheckoutSuccessful(true);
            setETag(result.headers.etag);
            getNewCart();
            dispatch(setCurrentOrderNumber(orderDto?.orderNum!));
            Cookies.remove(conf.cookies.orderId);
            history.push(conf.urls.order_confirmation)

            let user = token.userInfo ? sha256(token?.userInfo?.email!) : undefined;
            let categoryId = '123'
            dataLayer.push({
              event: 'recommendation',
              categoryId: categoryId,
              action: 'order',
              user: user,
              orderId: orderDtoUpdated.id,
              brand: "VELOX",
              'eventCallback': function () {
                util.serviceCallWrapper(
                    {
                      method: 'POST',
                      url: conf.urls.recommendationOrchestration
                          + '/trackings/orders/' + orderDtoUpdated.id,
                      headers: token.accessToken
                          ? {Authorization: `Bearer ${token.accessToken}`}
                          : {},
                    },
                    () => {
                    },
                    {},
                    () => {
                    }
                );
              }
            });
          }
        },
        {
          200: {
            'SUCCESS': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.200'}/>
          },
          404: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.404'}/>
          },
          403: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.403'}/>
          },
          412: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.412'}/>
          },
          417: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.417'}/>
          },
          428: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.428'}/>
          },
          500: {
            'ERROR': <Trans i18nKey={'checkout.confirmOrder.serviceCall.result.500'}/>
          },
        },
        () => {
        },
        false,
        true
    );
  };

  const updateAddress = (address: UserDto, isBillingAddress: boolean) => {
    handleCreateOrUpdateUser();
    let orderDtoUpdated = orderDto!;
    if (isBillingAddress) {
      orderDtoUpdated.billingAddress = address.addressDto
    } else {
      orderDtoUpdated.shippingAddress = address.addressDto
    }
    util.serviceCallWrapper({
          method: 'PATCH',
          url: conf.urls.checkoutOrchestration + '/' + orderDtoUpdated?.id,
          data: orderDtoUpdated,
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'If-Match': ETag,
          },
        },
        (result: AxiosResponse) => {
          if (result.status === 200) {
            setCheckoutSuccessful(true);
            setETag(result.headers.etag);
            setOrderDto(result.data);
            setIsUserCreated(true)
          }
        },
        {
          200: {
            'SUCCESS': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.200'}/>
          },
          404: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.404'}/>
          },
          403: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.403'}/>
          },
          412: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.412'}/>
          },
          417: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.417'}/>
          },
          428: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.428'}/>
          },
          500: {
            'ERROR': <Trans i18nKey={'checkout.updateAddress.serviceCall.result.500'}/>
          },
        },
        () => {
        }
    );
  };

  const renderItem = (item: OrderEntryDtoExtended) => {
    return (<CheckoutItem key={item.articleId} item={item}/>);
  };

  return (
      isLoginPending ?
          (isUserCreated ? (
                      <div>
                        <div className="checkoutForm">
                          <UserAddress key={Math.random()}
                                       billingUser={billingUser}
                                       shippingUser={shippingUser}
                                       isUserCreated={isUserCreated}
                                       updateAddress={updateAddress}
                                       toggleShipmentAddress={toggleShipmentAddress}
                                       editShipmentAddress={editShipmentAddress}
                                       buttonMessage={t('checkout.checkoutBody.checkoutForm.buttonMessage.value')}/>
                        </div>


                        <div className="container checkoutSummary">
                          <h1 className="label text-left">
                            <> {t('checkout.checkout.checkoutSummary.label')}</>
                          </h1>

                          <Row className="checkoutHeader">
                            <Col xs={4}
                                 className="checkoutProduct"> {/* checkoutProduct can be removed not in index.css*/}
                              <>{t('checkout.checkout.checkoutSummary.product')}</>
                            </Col>
                            <Col xs={2} className="col-sm-2 col-4 text-center">
                              <> {t('checkout.checkout.checkoutSummary.quantity')}</>
                            </Col>
                            <Col xs={2} className="availability text-center">
                              <> {t('checkout.checkout.checkoutSummary.availability')}</>
                            </Col>
                            <Col xs={2} className="unitPrice">
                              <>{t('checkout.checkout.checkoutSummary.unitPrice')}</>
                            </Col>
                            <Col xs={2} className="col-sm-2 col-4 text-right">
                              <>{t('checkout.checkout.checkoutSummary.subtotal')}</>
                            </Col>
                          </Row>

                          {orderDraft.map(
                              (item: OrderEntryDtoExtended) => renderItem(item))}
                          <div className="policyText">
                            <p>
                              <Trans
                                  i18nKey="checkout.checkout.checkoutSummary.policyText" // optional -> fallbacks to defaults if not provided
                                  defaults="With this order you accept our general Terms and Conditions as well as our Privacy Policy." // optional defaultValue
                                  components={{a: <a/>}}
                              />
                            </p>

                          </div>
                          <Container fluid
                                     className="orderSummaryCheckout">
                            <div className="row amount">
                              <p className="col-sm-2 offset-sm-8  col-4 text-left">
                                <>{t('checkout.checkout.checkoutSummary.subtotal')}</>
                                :
                              </p>
                              <div className="col-sm-2 col-8 text-right">
                                {util.formatPrice(orderDto?.totalPrice, currency)}
                              </div>
                            </div>

                            <div className="row shipping">
                              <p className="col-sm-2 offset-sm-8 col-4 text-left">
                                <>{t('checkout.checkout.checkoutSummary.shipping')}</>
                                :
                              </p>
                              <div className="col-sm-2 col-8 text-right">
                                -
                              </div>
                            </div>

                            <div className="row tax">
                              <p className="col-sm-2 offset-sm-8  col-4 text-left">
                                <>{t('checkout.checkout.checkoutSummary.tax')}</>
                                :
                              </p>
                              <div className="col-sm-2 col-8 text-right">
                                -
                              </div>
                            </div>


                            <div className="row total">
                              <p className="col-sm-2 offset-sm-8  col-4 text-left">
                                <>{t('checkout.checkout.checkoutSummary.total')}</>
                                :
                              </p>
                              <div className="col-sm-2 col-8 text-right">
                                {util.formatPrice(orderDto?.totalPrice, currency)}
                              </div>
                            </div>

                          </Container>
                          <div className="row total">
                            <p className="col-sm-4">

                            </p>
                            <div className="col-sm-8 orderNowButton">
                              <CheckoutButton/>
                            </div>
                          </div>

                        </div>

                      </div>
                  ) :
                  (
                      <div>
                        <UserAddress key={Math.random()}
                                     shippingUser={shippingUser}
                                     billingUser={billingUser}
                                     isUserCreated={isUserCreated}
                                     updateAddress={updateAddress}
                                     toggleShipmentAddress={toggleShipmentAddress}
                                     editShipmentAddress={editShipmentAddress}
                                     buttonMessage={'Save'}/>
                      </div>
                  )
          ) :
          <div className='center-screen-spinner'>
            <Spinner animation="border" role="status" size="sm"/>{' '}Loading
            order data
          </div>
  );
};


export default CheckoutBody;