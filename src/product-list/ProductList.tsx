import React, {MouseEvent, useCallback, useEffect, useState} from 'react';
import ProductListItem from './ProductListItem';
import Cookies from 'js-cookie';
import conf from '../config';
import {Col, Container, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'
import util from '../util';
import {setCurrentCartItemNumber} from "../redux/actions/cartItemNumber";
import {sha256} from "js-sha256";
import RecommendedItem from "./RecommendedItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  AttributeValueObject,
  EnrichedProductEntity,
} from "../generated/api/catalogOrchestrationApi";
import {AxiosResponse} from "axios";
import {Currency} from "../../types/currency";
import {RecommendationDto} from "../generated/api/recommendationOrchestrationApi";
import {Token} from "../../types/token";
import {useTranslation} from 'react-i18next';

export interface ExtendedEnrichedProductEntity extends EnrichedProductEntity {
  attributeValues: Record<string, AttributeValueObject>
}


let dataLayer = window.dataLayer = window.dataLayer || [];
const ProductList = () => {

  const token: Token = useSelector((state: any) => state.addAuthData);
  const currency: Currency = useSelector((state: any) => state.currency);
  const [catalog, setCatalog] = useState<ExtendedEnrichedProductEntity[]>([]);
  const [multiVariantProducts, setMultiVariantProducts] = useState<Record<string, ExtendedEnrichedProductEntity[]>>({});
  const dispatch = useDispatch();
  const [recommendations, setRecommendations] = useState<RecommendationDto | undefined>(undefined);
  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: {max: 1024, min: 400},
      items: 1
    },
    mobile: {
      breakpoint: {max: 768, min: 0},
      items: 1
    }

  };
  const {t} = useTranslation();
  const getCatalog = useCallback(() => {
    if (currency) {
      util.serviceCallWrapper({
            method: 'GET',
            url: conf.urls.catalogOrchestration,
            params: {
              currencyId: currency.id
            },
            headers: token.accessToken
                ? {Authorization: `Bearer ${token.accessToken}`} : {}
          },
          (result: AxiosResponse) => {
            setCatalog(result.data.items.filter((product: { type: string; }) => product.type !== 'VARIANT'));
            let variantsArray: Record<string, ExtendedEnrichedProductEntity[]> = {};
            result.data.items
            .filter((product: ExtendedEnrichedProductEntity) => product.type === 'MULTI_VARIANT_PRODUCT')
            .forEach((multiVariantProduct: ExtendedEnrichedProductEntity) => {
              const variants = result.data.items.filter((product: ExtendedEnrichedProductEntity) => product.parentId === multiVariantProduct.id);
              variantsArray[multiVariantProduct.id!] = variants
            })
            setMultiVariantProducts(variantsArray);

            dataLayer.push({event: 'gtm.load'});
          },

          {},
          () => {
          }
      );
    }
  }, [token, currency]);

  const getRecommendations = useCallback(() => {
    const currencyId = currency ? currency.id : undefined;
    util.serviceCallWrapper({
          method: 'GET',
          url: conf.urls.recommendationOrchestration
              + '/recommendations/categories/123?length=6&currencyId=' + currencyId,
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {}
        },
        (result: AxiosResponse) => {
          setRecommendations(result.data);
        },
        {},
        () => {
        },
        false,
    );
  }, [token, currency]);

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
          url: conf.urls.cartOrchestration + '/' + cartId + '/items',
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
                  false,
                  () => {
                  },
              );
            }
          });

        },
        {
          200: {
            'SUCCESS': t('productList.productList.addItem.messages.ServiceCall.200', {name: item.name})
          },
          201: {
            'SUCCESS': t('productList.productList.addItem.messages.ServiceCall.201', {name: item.name})
          },
          409: {
            'ERROR': t('productList.productList.addItem.messages.ServiceCall.409', {name: item.name})
          }
        },
        () => {
        },
        false,
        true
    );
  };

  useEffect(() => {
    getCatalog()
    getRecommendations()
  }, [token, getCatalog, getRecommendations]);

  useEffect(() => {
    document.title = conf.pageTitles.plp;
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
  }, []);

  const renderItem = (item: ExtendedEnrichedProductEntity) => {
    return (<ProductListItem key={Math.random()} item={item}
                             variants={Object.keys(multiVariantProducts).filter(variant => variant === item.id).length > 0 ?
                                 multiVariantProducts[item.id!] :
                                 []
                             }
                             handleAddToCart={(e) => handleAddToCart(e, item)}
    />);
  };

  const renderRecommendation = (recommendation: EnrichedProductEntity) => {
    return (<RecommendedItem key={Math.random()} recommendation={recommendation}

    />);
  };

  return (
      <Container fluid className="plp">

        <div className="recommendation">
          <div className="articles">
            {recommendations ?
                <div>
                  <div className="recommendationTitle">
                    <b><>{t('productList.productList.bestsellers.title')}</>
                    </b>
                  </div>
                  <Carousel
                      swipeable={true}
                      draggable={true}
                      showDots={true}
                      responsive={responsive}
                      ssr={true} // means to render carousel on server-side.
                      infinite={true}
                      keyBoardControl={true}
                      customTransition="all .5"
                      transitionDuration={500}
                      containerClass="carousel-container"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      dotListClass="custom-dot-list-style"
                      itemClass="carousel-item-padding-40-px">
                    {recommendations?.articles?.map(
                        (recommendation: EnrichedProductEntity) => renderRecommendation(
                            recommendation))}
                  </Carousel>
                </div>
                :
                ""
            }
          </div>
        </div>
        <div className="itemList">
          {/*page name row  */}
          <Row>
            <Col>
              {/*<h2>Place for breadcrumb</h2>*/}
              <h2>{""}</h2>
            </Col>
          </Row>


          {/*header row*/}
          <Row className="header">
            <Col md={{span: 4, offset: 2}}
                 className="product label">
              <>{t('productList.productList.tableHader.product.label')}</>
            </Col>
            <Col md={2} className="articleNumber label">
              <>{t('productList.productList.tableHader.availability.label')}</>
            </Col>
            <Col md={2} className="price label">
              <>{t('productList.productList.tableHader.price.label')}</>
            </Col>
            <Col md={2} className="buy label">
              <>{t('productList.productList.tableHader.buy.label')}</>
            </Col>
          </Row>
          <Row>
            <Col xs={1}> </Col>
            <Col xs={10}
                 className="mobileTitle"><>{t('productList.productList.tableHader.product.label')}</>
            </Col>

            <Col xs={1}></Col>

          </Row>
          {catalog.map((item) => renderItem(item))}
          <Row xs={2} className="shipping">
            <Col xs={1} className="image"/>
          </Row>
        </div>
      </Container>

  );
};

export default ProductList
