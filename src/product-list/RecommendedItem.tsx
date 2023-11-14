import React from 'react';
import util from "../util";
import {Container, Row} from "react-bootstrap";
import {sha256} from "js-sha256";
import conf from "../config";
import {useHistory} from "react-router-dom";
import {EnrichedProductEntity,} from "../generated/api/recommendationOrchestrationApi";
import {useSelector} from "react-redux";
import {Token} from "../../types/token";

let dataLayer = window.dataLayer = window.dataLayer || [];

export interface RecommendedItemProps {
  recommendation: EnrichedProductEntity,
}

const RecommendedItem = ({recommendation}: RecommendedItemProps) => {
  const token: Token = useSelector((state: any) => state.addAuthData);
  const history = useHistory();
  const handleOpenPdp = (recommendation: EnrichedProductEntity) => {
    let user = token.userInfo ? sha256(token?.userInfo?.email!) : undefined;
    let userEmail = token.userInfo ? token.userInfo.email : undefined;
    let categoryId = '123'
    dataLayer.push({
      event: 'recommendation',
      categoryId: categoryId,
      articleId: recommendation.id,
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
                articleId: recommendation.id,
                action: 'recommendation',
                userId: userEmail,
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
    history.push({
      pathname: conf.urls.product_detail,
      state: {item: recommendation, variants: []}
    })
  }

  return (
      <Container fluid>
        <Row className="articleInfo">
          {recommendation && recommendation.images ?
              <img src={recommendation.images[0].url}
                   alt={recommendation.id}
                   className="articleImage"
                   onClick={() => {
                     handleOpenPdp(recommendation)
                   }}/>
              :
              ""
          }
        </Row>
        <Row className="articleInfo">
          {util.displayPricePLP(recommendation?.prices!)}
        </Row>
        <Row className="articleInfo">
          <p className="name">{recommendation?.name?.substring(0, 27)}</p>
        </Row>
      </Container>
  );

}

export default RecommendedItem;