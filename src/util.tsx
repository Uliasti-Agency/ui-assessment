import React from 'react';
import {Badge, OverlayTrigger, Popover} from 'react-bootstrap';
import axios, {AxiosRequestConfig} from 'axios';
import {toast} from 'react-toastify';
import Message, {MessageProps} from './global/Message';
import conf from './config';
import Cookies from 'js-cookie';
import {CurrencyDto} from "./generated/api/priceOrchestrationApi";
import {AvailabilityDto, ItemDto, MessageDto} from "./generated/api/cartOrchestrationApi";
import {PriceDto} from "./generated/api/catalogOrchestrationApi";
import {Placement} from "react-bootstrap/types";
import {AuthContextProps} from "oidc-react/build/src/AuthContextInterface";
import {Trans, useTranslation} from 'react-i18next';

const util = {
  formatPrice: function (price: number | undefined, currency: CurrencyDto | undefined) {
    if (price) {
      if (currency && currency.symbol) {
        return `${currency.symbol} ${price}`;
      } else {
        return price;
      }
    } else {
      return '-';
    }
  },

  displayPrice: function (price: number | undefined, currency: CurrencyDto | undefined) {
    return <p style={{margin: 0}}>{this.formatPrice(price, currency)}</p>;
  },

  displayPricePLP: function (price: PriceDto[] | null) {
    if (price == null) {
      return (
          <p style={{margin: 0, padding: 0}}>
            <Trans i18nKey={'utils.displayPricePLP.message.onRequest'}/>
          </p>
      )
    }
    return (
        <p style={{margin: 0, padding: 0}}>{util.formatPrice(price[0].unitPrice,
            price[0].currency)}</p>
    )
  },

  displayAvailability: function (availability: AvailabilityDto | null | undefined) {
    if (availability == null) {
      return (
          <Badge pill bg="secondary">
            <Trans i18nKey={'utils.displayAvailability.message.unknown'}/>
          </Badge>
      );
    } else if (availability.status === 'NOT_AVAILABLE') {
      if (availability?.replenishmentTime! > 0) {
        return (
            <Badge pill bg="warning">
              {availability.quantity} <Trans
                i18nKey={'utils.displayAvailability.message.atSupplier'}/>
            </Badge>
        );
      } else return (
          <Badge pill bg="danger">
            <Trans i18nKey={'utils.displayAvailability.message.outOfStock'}/>
          </Badge>
      );
    } else if (availability.status === 'IN_STOCK') {
      return (
          <span className="badge badge-pill badge-success">
            {availability.quantity} <Trans
              i18nKey={'utils.displayAvailability.message.quantityInStock'}/>
          </span>
      );
    } else return (
        <span className="badge badge-pill badge-success">
          <Trans i18nKey={'utils.displayAvailability.message.inStock'}/>
        </span>
    );
  },

  displayItemDesignator: function (item: ItemDto) {
    return item.name === null || item.name == undefined ? item.articleId : item.name;
  },

  /**
   * serviceCallWrapper
   * @param  {Object} axiosConfig configuration to perform axios API call
   * @param  {function} processServiceCallResponse function to process the response of the axios call to service
   * @param {Object } messageConfig HTTP response statuses returned by the axios call to service, accompanied with message levels and text content
   * @param {function} processServiceCallError function that is called when the error in the axios call occurs
   * @param {boolean} showErrorMessages boolean value that specifies whether the error messages should be shown
   * @return {void} function does not return any value
   *
   * Example of serviceCallWrapper call
   * serviceCallWrapper({
          method: 'PATCH',
          url: https://...,
          data: someObject,
          headers: accessToken
              ? {Authorization: `Bearer ${accessToken}`} : {},
        },
   (result) => {someFunctionThatProcessCallResult(result)},
   {
            200: {
                  'SUCCESS': 'Item quantity is changed!'
                 },
            404: {
                  'ERROR': 'Item not found.'
                },
        },
   () => {someFunctionThatIsCalledOnError()}
   );
   */
  serviceCallWrapper: function (axiosConfig: AxiosRequestConfig, processServiceCallResponse: Function, messageConfig: any, processServiceCallError: Function, showErrorMessages = true, showResponseMessages: boolean = true) {
    axios(axiosConfig)
    .then(result => {
      processServiceCallResponse(result)
      if (Object(messageConfig).hasOwnProperty(result.status)) {
        toast(<Message level={Object.keys(messageConfig[result.status])[0]}
                       message={Object.values(messageConfig[result.status])[0] as string}/>,
            conf.messageOptionsSuccess);
      } else if (result.data.messages && showResponseMessages) {
        result.data.messages.map((message: MessageDto) => {
          if (message.level && message.message) {
            toast(<Message level={message.level === "INFO" ? "SUCCESS" : message.level}
                           message={message.message}/>, conf.messageOptionsSuccess);
          }
        })
      }
    })
    .catch(error => {
      if (processServiceCallError !== undefined) {
        processServiceCallError();
      }

      if (showErrorMessages === true) {

        if (error.response !== undefined && error.response.status !== undefined && Object(messageConfig).hasOwnProperty(error.response.status)) {
          toast(<Message
                  level={Object.keys(messageConfig[error.response.status])[0]}
                  message={Object.values(
                      messageConfig[error.response.status])[0] as string}/>,
              conf.messageOptionsOther);
        } else {
          const {t} = useTranslation();
          toast.error(<Message level={"ERROR"}
                               message= {t('utils.serviceCallWrapper.error.message')} />, conf.messageOptionsOther);
        }
      }
    })
  },
  /**
   * retrieveCart
   * @param  {Object} auth oidc-react auth object
   * @param  {function} getNewCart function to get new cart from the corresponding back-end service
   * @param {function } fetchCart function to get existing cart based on the cartId cookie from the corresponding back-end service
   * @param {String} accessToken accessToken of the authenticated user
   * @return {void} function does not return any value
   *
   * Example of retrieveCart call
   * retrieveCart(auth, getNewCart, fetchCart, accessToken);
   */
  retrieveCart: async function (auth: AuthContextProps, getNewCart: () => void, fetchCart: () => void, accessToken: string | null | undefined) {
    //if the user is logged in
    if (await auth && await auth.userManager.getUser()) {
      //wait for accessToken to be retrieved and then create or fetch the cart
      if (accessToken) {
        if (Cookies.get(conf.cookies.cartId) === undefined) {
          getNewCart();
        } else {
          fetchCart();
        }
      }
    }
    //user is not logged in
    else {
      if (Cookies.get(conf.cookies.cartId) === undefined) {
        getNewCart();
      } else {
        fetchCart();
      }
    }
  },

  /**
   * displayItemMessage
   * @param  {Object} messages list of objects that contain the message level and message content
   * @return {OverlayTrigger} function returns message icon with the message content available on icon hover
   *
   * Example of displayItemMessage call
   * displayItemMessage(message, "top");
   */
  displayItemMessage: function (messages: MessageDto[], placement: Placement = "right") {
    const popover = (message: string) => {
      return (
          <Popover id="popover-main">
            <Popover.Body className="popover-basic">
              {message}
            </Popover.Body>
          </Popover>
      )
    }

    if (messages && messages.length > 0) {
      //here we concatenate all messages and calculate message Level
      let messageContent = '';
      let messageLevel: "INFO" | "WARNING" | "ERROR" | undefined = 'INFO';
      messages.forEach(messageItem => {
        messageContent += '- ' + messageItem.message + "\n";
        if (messageLevel === 'INFO' && messageItem.level !== 'INFO') {
          messageLevel = messageItem.level;
        } else if (messageLevel === 'WARNING' && messageItem.level === "ERROR") {
          messageLevel = messageItem.level;
        }
      })

      if (messageLevel === 'INFO') {
        return (
            <OverlayTrigger trigger={['hover', 'hover']} placement={placement}
                            overlay={popover(messageContent)}>
              <span className='d-inline-block'>
                <img src="/assets/messages/circle-info.svg" style={{width: 20, height: 20}}
                     alt='circle-info'/>
              </span>
            </OverlayTrigger>
        )
      } else if (messageLevel === 'WARNING') {
        return (
            <OverlayTrigger trigger={['hover', 'hover']} placement={placement}
                            overlay={popover(messageContent)}>
              <span className='d-inline-block'>
                <img src="/assets/messages/circle-warning.svg" style={{width: 20, height: 20}}
                     alt='circle-warning'/>
              </span>
            </OverlayTrigger>
        )
      } else {
        return (
            <OverlayTrigger trigger={['hover', 'hover']} placement={placement}
                            overlay={popover(messageContent)}>
              <span className='d-inline-block'>
                <img src="/assets/messages/circle-error.svg" style={{width: 30, height: 30}}
                     alt='circle-error'/>
              </span>
            </OverlayTrigger>
        )
      }
    } else return "";
  }


};
export default util;