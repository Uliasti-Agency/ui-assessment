import React, {useEffect, useState} from "react";
import {Col, Dropdown, Row} from "react-bootstrap";
import "../i18n/i18n";
import {ChoiceAttributeObject,} from "../generated/api/catalogOrchestrationApi";
import {ExtendedEnrichedProductEntity} from "../product-list/ProductList";

export interface ProductVariantSwitchProps {
  item: ExtendedEnrichedProductEntity,
  variants: ExtendedEnrichedProductEntity[],
  selectedVariant: ExtendedEnrichedProductEntity,
  selectedVariantAttributes: Record<any, any>
  setSelectedVariantAttributes: (attributes: Record<string, any>) => void,
  setCurrentVariant: (variant: ExtendedEnrichedProductEntity) => void,
}

const ProductVariantSwitch = ({
                                item,
                                variants,
                                selectedVariant,
                                setCurrentVariant,
                                selectedVariantAttributes,
                                setSelectedVariantAttributes
                              }: ProductVariantSwitchProps) => {

  const [choiceAttributesMap, setChoiceAttributesMap] = useState<ChoiceAttributeObject[] | undefined>(
      item.choiceAttributes);

  const handleChoiceChange = (event: React.MouseEvent<HTMLElement>, choiceAttrId: string, choiceId: string) => {
    const variantAttributeKeys = Array.from(
        selectedVariantAttributes.keys()).filter(key => key !== choiceAttrId);

    let newSelectedVariant = variants.filter(v => {
      let condition = true;
      variantAttributeKeys.forEach(key => {
        condition = condition && v.attributeValues[key as string]
            && v.attributeValues[key as string].id === selectedVariantAttributes.get(key);
      })

      condition = condition && v.attributeValues[choiceAttrId]
          && v.attributeValues[choiceAttrId].id === choiceId
      return condition;
    });

    if (newSelectedVariant.length === 0) {
      newSelectedVariant = variants.filter(v => (v.attributeValues[choiceAttrId]
          && v.attributeValues[choiceAttrId].id === choiceId));
    }

    let updatedSelectedVariantAttributes = selectedVariantAttributes;
    if (newSelectedVariant.length > 0) {
      let keys = Object.keys(newSelectedVariant[0].attributeValues);
      let attributes = newSelectedVariant[0].attributeValues;
      keys.forEach(key =>
          updatedSelectedVariantAttributes.set(key, attributes[key].id)
      )
    }
    setSelectedVariantAttributes(updatedSelectedVariantAttributes);
    setCurrentVariant(newSelectedVariant[0]);
  }

  useEffect(() => {
    let updatedSelectedVariantAttributes = selectedVariantAttributes;
    if (selectedVariant !== undefined) {
      var keys = Object.keys(selectedVariant.attributeValues);
      var attributes = selectedVariant.attributeValues;
      keys.forEach(key =>
          updatedSelectedVariantAttributes.set(key, attributes[key].id)
      )
    }
  }, [item, selectedVariant, selectedVariantAttributes]);

  return (
      <div className="productVariantSwitch">
        {choiceAttributesMap?.map(choiceAttribute => {
          return (
              <Row className="variant" key={Math.random()}>
                <Col xs={3} className="label"><p>{choiceAttribute.name!.toString()}</p>
                </Col>
                <Col xs={3} >
                  <Dropdown>

                    <Dropdown.Toggle id="dropdown-basic" className="main">
                      {selectedVariant.attributeValues[choiceAttribute.id!]
                      !== undefined
                          ? selectedVariant.attributeValues[choiceAttribute.id!].name as unknown as string
                          : ""}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="menu">
                      {choiceAttribute?.values?.map((choice: ChoiceAttributeObject) => {
                        return <Dropdown.Item className="" onClick={(event) => {
                          handleChoiceChange(event, choiceAttribute.id || '', choice.id || '')
                        }} name={choiceAttribute.name} key={choice.id}
                                              value={choice.name}>{choice.name!.toString()}</Dropdown.Item>
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
          )
        })}
      </div>
  );
}

export default ProductVariantSwitch;
