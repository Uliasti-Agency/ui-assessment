import React, {MouseEvent, useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap"
import util from '../util';
import Carousel from "react-multi-carousel";
import ProductVariantSwitch from "./ProductVariantSwitch";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import conf from "../config";
import {PriceDto} from "../generated/api/catalogOrchestrationApi";
import {Token} from "../../types/token";
import {useSelector} from "react-redux";
import {AxiosResponse} from "axios";
import {Currency} from "../../types/currency";
import {ExtendedEnrichedProductEntity} from "../product-list/ProductList";
import {Trans} from 'react-i18next';

const responsive = {
  desktop: {
    breakpoint: {max: 3000, min: 1024},
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: {max: 1024, min: 464},
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

export interface ProductDetailItemProps {
  item: ExtendedEnrichedProductEntity,
  variants: ExtendedEnrichedProductEntity[],
  handleAddToCart: (e: MouseEvent) => void,
  selectedVariantAttributes: Record<any, any>
  setSelectedVariantAttributes: (variants: Record<any, any>) => void,
}

const ProductDetailItem = ({
                             item,
                             handleAddToCart,
                             variants,
                             selectedVariantAttributes,
                             setSelectedVariantAttributes,
                           }: ProductDetailItemProps) => {

  const [isMounted, setIsMounted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ExtendedEnrichedProductEntity>(variants.length > 0 ? variants[0] : item);
  const token: Token = useSelector((state: any) => state.addAuthData);
  const currency: Currency = useSelector((state: any) => state.currency);

  const setCurrentVariant = (newVariant: ExtendedEnrichedProductEntity) => {
    setSelectedVariant(newVariant);
  }

  const getItem = () => {
    const currencyId = currency ? currency.id : undefined;
    util.serviceCallWrapper({
          method: 'GET',
          url: conf.urls.catalogOrchestration
              + '/' + selectedVariant.id + '?currencyId=' + currencyId,
          headers: token.accessToken
              ? {Authorization: `Bearer ${token.accessToken}`} : {}
        },
        (result: AxiosResponse) => {
          if (isMounted) {
            setSelectedVariant(
                result.data
            );
          }
        },
        {},
        () => {
        },
        false,
    );
  };

  useEffect(() => {
    setIsMounted(true);
    getItem();
    return () => {
      setIsMounted(false);
    }
  }, [token, currency, getItem]);


  const displayPrice = (price: PriceDto[] | undefined) => {
    if (price == null) {
      return (

          <p style={{margin: 0, padding: 0}}><Trans i18nKey={'utils.displayPricePLP.message.onRequest'}/></p>
      )
    }
    return (
        <p style={{margin: 0, padding: 0}}>{util.formatPrice(
            price[0].unitPrice,
            price[0].currency)}</p>
    )
  }

  const displayAddToCartButton = (variant: ExtendedEnrichedProductEntity) => {
    if (variant.orderable === false) {
      return (
          <Button variant="primary"
                  onClick={handleAddToCart} disabled>
            <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.addToCart.label'}/>
          </Button>
      )
    }
    return (
        <Button variant="primary"
                onClick={handleAddToCart}>
          <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.addToCart.label'}/>
        </Button>
    )
  }

  return (
      <Row className="tableContent">
        <Col className="imagePdp" xs={6}>
          <Carousel
              swipeable={true}
              draggable={true}
              showDots={true}
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              keyBoardControl={true}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              itemClass="carousel-item-padding-40-px">
            <div>
              {item.images && selectedVariant && selectedVariant.images ?
                  <InnerImageZoom fullscreenOnMobile={false}
                                  mobileBreakpoint={768}
                                  zoomScale={1.5}
                                  hasSpacer={true}
                                  zoomPreload={true}
                                  zoomType="click"
                                  src={selectedVariant.images[0].url!}
                                  className="articleImagePdp"/>
                  :
                  <img src={"/assets/VeloxLogo-Grey.png"}
                       alt={'velox-logo-grey'}
                       className="articlePlaceholder"/>}
            </div>
          </Carousel>
        </Col>
        <Col className="pdpItem" xs={6}>
          <Row>
            <Col className="name">
              {selectedVariant.name}
            </Col>
          </Row>

          <Row>
            <Col className='description'>
              {selectedVariant.description ? <div
                      dangerouslySetInnerHTML={{__html: selectedVariant.description}}/>
                  : ""}
            </Col>
          </Row>
          {variants.length ?
              <ProductVariantSwitch item={item}
                                    variants={variants}
                                    selectedVariant={selectedVariant}
                                    setCurrentVariant={setCurrentVariant}
                                    selectedVariantAttributes={selectedVariantAttributes}
                                    setSelectedVariantAttributes={setSelectedVariantAttributes}
              />
              :
              ""
          }
          <Row>
            <Col xs={3} className="label">
              <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.stock.label'}/>
            </Col>

            <Col xs={3} className="itemInfo">
              {util.displayAvailability(
                  selectedVariant.availability)}
            </Col>
          </Row>
          <Row>
            <Col xs={3} className="label">
              <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.artNr.label'}/>
            </Col>
            <Col className="value">
              {selectedVariant.id}
            </Col>
          </Row>
          <Row>
            <Col xs={3} className="label">
              <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.price.label'}/>
            </Col>
            <Col xs={3} className="value">
              {displayPrice(selectedVariant.prices)}
            </Col>
            <Col xs={{offset: 1}}
                 className="button">{displayAddToCartButton(
                selectedVariant)}</Col>
          </Row>
        </Col>

        <Row className="mobile pdp">
          <Row>
            <Col xs={11} className="name">
              {selectedVariant.name}
            </Col>
          </Row>
          <Col xs={12}>

            <Row className="mobileImage">

              <Col>{item.images ? <img
                      src={selectedVariant.images?selectedVariant.images[0].url:""}
                      alt={selectedVariant.id}
                      className="articleImage"/> :
                  <img src={"/assets/VeloxLogo-Grey.png"}
                       alt={item.id}
                       className="articlePlaceholder"/>}</Col>
            </Row>
          </Col>
          <Row className="productDetailItem">
            <Col className="itemInfo mobileAvailability">
              {util.displayAvailability(
                  selectedVariant.availability)}
            </Col>
          </Row>
          <Row className="productDetailItem">
            <Col xs={12} className='mobileDescription'>
              {selectedVariant.description ? <div
                      dangerouslySetInnerHTML={{__html: selectedVariant.description}}/>
                  : ""}
            </Col>
          </Row>

          {variants.length ?
              <ProductVariantSwitch item={item}
                                    variants={variants}
                                    selectedVariant={selectedVariant}
                                    setCurrentVariant={setCurrentVariant}
                                    selectedVariantAttributes={selectedVariantAttributes}
                                    setSelectedVariantAttributes={setSelectedVariantAttributes}
              />
              :
              ""
          }

          <Row className="productDetailItem">
            <Col xs={3} className="mobileLabel"><Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.artNr.label'}/></Col>
            <Col xs={9} className="mobileValue">{selectedVariant.id}</Col>
          </Row>
          <Row className="productDetailItem">
            <Col xs={3} className="mobileLabel">
              <Trans i18nKey={'productDetailItem.productDetailItem.tableHeader.price.label'}/>
            </Col>
            <Col xs={9} className="mobileValue">
              {displayPrice(selectedVariant.prices)}
            </Col>
          </Row>
          <Col md={2} className="itemInfo price col-content">
            <Row className="pdpAdd">
              <Col
                  className="Badge mobile">{displayAddToCartButton(
                  selectedVariant)}</Col>
            </Row>
          </Col>
        </Row>
      </Row>
  );
}

export default ProductDetailItem;

