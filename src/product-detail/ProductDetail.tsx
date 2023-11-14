import React, {MouseEvent, useEffect, useState} from 'react';
import ProductDetailItem from './ProductDetailItem';
import Cookies from 'js-cookie';
import conf from '../config';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useLocation} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
import util from '../util';
import {useAuth} from 'oidc-react';
import {setCurrentCartItemNumber} from "../redux/actions/cartItemNumber";
import {sha256} from "js-sha256";
import {AxiosResponse} from "axios";
import {Token} from "../../types/token";
import {Currency} from "../../types/currency";
import {ExtendedEnrichedProductEntity} from "../product-list/ProductList";
import {useTranslation} from 'react-i18next';

let dataLayer = window.dataLayer = window.dataLayer || [];

interface ExtendedLocation {
  item: ExtendedEnrichedProductEntity,
  variants: ExtendedEnrichedProductEntity[]
}

const ProductDetail = () => {

  const token: Token = useSelector((state: any) => state.addAuthData);
  const currency: Currency = useSelector((state: any) => state.currency);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const auth = useAuth();
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState<Record<any, any>>(
      new Map());
  const location = useLocation();
  const state = location.state as ExtendedLocation;
  const history = useHistory();
  const {item} = state; // useState<EnrichedProductEntity>(window.location.state.item);
  const {variants} = state; // useState<EnrichedProductEntity[]>(window.location.state.variants);

  const handleAddToCart = (event: MouseEvent, item: ExtendedEnrichedProductEntity) => {
    const article = {
      'articleId': item.id,
      'quantity': 1,
      'price': item.prices ? item.prices[0].unitPrice : null,
      'unitPrice': item.prices ? item.prices[0].unitPrice : null,
    };
    const cartId = Cookies.get(
        conf.cookies.cartId
    );
    util.serviceCallWrapper(
        {
          method: 'POST',
          url: conf.urls.cartOrchestration + '/' + Cookies.get(
              conf.cookies.cartId) + '/items',
          data: article,
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`}
              : {},
        },
        (result: AxiosResponse) => {
          dispatch(setCurrentCartItemNumber(result.data.items.length));
          let user = token.userInfo ? sha256(token?.userInfo?.email!) : undefined;
          let userEmail = token.userInfo ? token.userInfo.email : undefined;
          let categoryId = '123'
          dataLayer.push({
            event: 'recommendation',
            categoryId: categoryId,
            articleId: item.id,
            action: 'add_to_cart',
            userId: user,
            cartId: cartId,
            quantity: 1,
            brand: "VELOX",
            'eventCallback': function () {
              util.serviceCallWrapper(
                  {
                    method: 'POST',
                    url: conf.urls.recommendationOrchestration + '/trackings',
                    data: {
                      categoryId: categoryId,
                      articleId: item.id,
                      action: 'add_to_cart',
                      userId: userEmail,
                      cartId: cartId,
                      quantity: 1,
                      brand: "VELOX"
                    },
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
        },
        {
          201: {
            'SUCCESS': t('productDetail.productDetail.addItem.messages.ServiceCall.201', {name: item.name})
          },
          409: {
            'ERROR': t('productDetail.productDetail.addItem.messages.ServiceCall.409', {name: item.name})
          },
        },
        () => {
        },
        true,
    )
  };

  useEffect(() => {
    document.title = item.name + " | VELOX";
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
  }, [token, currency]);

  const renderItem = (item: ExtendedEnrichedProductEntity, variants: ExtendedEnrichedProductEntity[]) => {
    return (<ProductDetailItem key={Math.random()}
                               item={item}
                               variants={variants}
                               handleAddToCart={(e) => handleAddToCart(e, item)}
                               selectedVariantAttributes={selectedVariantAttributes}
                               setSelectedVariantAttributes={setSelectedVariantAttributes}
    />);
  };

  return (
      <div className="">
        <div className="container pdpPage">
          {
            <div>
              {renderItem(item, variants)}
            </div>
          }
        </div>
      </div>
  );
};

export default ProductDetail;
