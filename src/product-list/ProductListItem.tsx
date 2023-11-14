import React, {MouseEvent} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap"
import util from '../util';
import conf from '../config';
import {sha256} from 'js-sha256'
import {useHistory} from "react-router-dom";
import {Token} from "../../types/token";
import {useSelector} from "react-redux";
import {EnrichedProductEntity} from "../generated/api/catalogOrchestrationApi";
import {ExtendedEnrichedProductEntity} from "./ProductList";
import {Trans} from 'react-i18next';

let dataLayer = window.dataLayer = window.dataLayer || [];

export interface ProductListItemProps {
  item: ExtendedEnrichedProductEntity,
  variants: ExtendedEnrichedProductEntity[],
  handleAddToCart: (e: React.MouseEvent, item: EnrichedProductEntity) => void,

}

const ProductListItem = ({
                           item,
                           variants,
                           handleAddToCart,
                         }: ProductListItemProps) => {
  const history = useHistory();
  const token: Token = useSelector((state: any) => state.addAuthData);

  const handleOpenPdp = (item: ExtendedEnrichedProductEntity) => {
    let user = token.userInfo ? sha256(token?.userInfo?.email!)
        : undefined;
    let userEmail = token.userInfo ? token.userInfo.email : undefined;
    let categoryId = '123'
    if (item.type !== 'MULTI_VARIANT_PRODUCT') {
      dataLayer.push({
        event: 'recommendation',
        categoryId: categoryId,
        articleId: item.id,
        action: 'click',
        user: user,
        brand: "VELOX",
        'eventCallback': function () {
          util.serviceCallWrapper(
              {
                method: 'POST',
                url: conf.urls.recommendationOrchestration + '/trackings',
                data: {
                  categoryId: categoryId,
                  articleId: item.id,
                  action: 'click',
                  userId: userEmail,
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
              }
          );
        }
      });
    }
    history.push({
      pathname: conf.urls.product_detail,
      state: {item: item, variants: variants}
    })
  }

  const displayAddToCartAndSelectButton = (item: ExtendedEnrichedProductEntity) => {
    if (item.orderable === false) {
      return (
          <Button variant="primary"
                  onClick={(e: MouseEvent) => handleAddToCart(e, item)} disabled>{item.type
          === 'MULTI_VARIANT_PRODUCT' ? <> <Trans
                  i18nKey={'productListItem.productListItem.selectVarient.label'}/>  </>
              : <> <Trans
                  i18nKey={'productListItem.productListItem.addtoCart.label'}/> </>}</Button>
      )
    }
    return (
        <Button variant="primary"
                onClick={(e) => {
                  item.type === 'MULTI_VARIANT_PRODUCT' ? handleOpenPdp(
                          item)
                      : handleAddToCart(e, item)
                }}>
          {item.type === 'MULTI_VARIANT_PRODUCT' ?
              <Trans i18nKey={'productListItem.productListItem.selectVarient.label'}/>
              : <>  <Trans i18nKey={'productListItem.productListItem.addtoCart.label'}/></>}
        </Button>
    )
  }

  return (
      <Container fluid>
        <Row className="item">
          <Col md={2} className="image">{item.images ? <img
                  src={item.images[0].url}
                  alt={item.id}
                  className="articleImage" onClick={() => {
                handleOpenPdp(item)
              }}/> :
              <img src={"/assets/VeloxLogo-Grey.png"} alt={'velox-logo-grey'}
                   className="articlePlaceholder" onClick={() => {
                handleOpenPdp(item)
              }}/>}</Col>
          <Col md={4} className="product col-content">
            <Row className="labelName">
              <Col xs={{span: 10, offset: 2}} className="name"
                   onClick={() => {
                     handleOpenPdp(item)
                   }}>
                {item.name}
              </Col>
            </Row>
            <Row className='description'>
              <Col className="label">
                {item.description ? <Col
                        className="description" onClick={() => {
                      handleOpenPdp(item)
                    }}
                        dangerouslySetInnerHTML={{__html: item.description}}/>
                    : ""}

              </Col>
            </Row>
            <Row className="mobileImage">
              <Col>{item.images ? <img
                      src={item.images[0].url} alt={item.id}
                      className="articleImage" onClick={() => {
                    handleOpenPdp(item)
                  }}/> :
                  <img src={"/assets/VeloxLogo-Grey.png"}
                       alt={item.id}
                       className="articlePlaceholder"/>}</Col>
            </Row>


            <Row className="itemInfo mobileAvailability">
              <Col>
                {item.type === 'MULTI_VARIANT_PRODUCT' ?
                    ''
                    :
                    util.displayAvailability(
                        item && item.availability
                            ? item.availability : null)
                }
              </Col>
            </Row>
          </Col>

          <Col md={1} className="articleNumber col-content">
            <Row>

              <Col className="mobileValue">{item.description ? <Col
                      dangerouslySetInnerHTML={{__html: item.description}}/>
                  : ""}
              </Col>
            </Row>
          </Col>
          <Col md={2} className="itemInfo availability col-content">
            {item.type === 'MULTI_VARIANT_PRODUCT' ?
                ''
                :
                util.displayAvailability(
                    item && item.availability
                        ? item.availability : null)
            }
          </Col>
          <Col md={2} className="itemInfo price col-content">
            <Row>
              <Col className="mobileLabel"> <Trans
                  i18nKey={'productListItem.productListItem.price.label'}/> </Col>
              <Col className="mobileDescription">
                {item.type === 'MULTI_VARIANT_PRODUCT' ?
                    ''
                    :
                    util.displayPricePLP(
                        item && item.prices
                            ? item.prices : null)
                }
              </Col>
            </Row>
          </Col>
          <Col md={2} className="itemInfo price col-content">
            <Row>
              <Col
                  className="Badge mobile">{displayAddToCartAndSelectButton(
                  item)}</Col>
            </Row>
          </Col>
        </Row>
      </Container>

  );
}

export default ProductListItem;