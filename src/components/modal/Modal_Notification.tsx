import React, { useEffect, useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import CommonApi from "@apis/common-api";
import { css, styled } from "@styles/stitches.config";

import Space from "@components/Space";
import Column from "@components/Column";
import { Modal } from "@components/Modal";
import BellIcon from "@components/icon/Icon_Bell";

import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

interface Props {}

const NotificationModal: React.FC<Props> = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);

  const { data } = useApi(CommonApi.notification, {
    suspense: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
    }, 3000);
  }, [data]);

  if (!data) return <></>;

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      className={css({ width: rem(220), paddingY: rem(20), paddingX: rem(16) })}
      onConfrim={(close) => close()}
      confirmText={t("close")}
    >
      <Wrapper>
        <BellIconContainer>
          <BellIcon size={22} />
        </BellIconContainer>
        <Title>확진자 {data.cases}명 추가</Title>
        <Column css={{ paddingY: rem(14) }}>
          {Object.keys(data.data || {}).map((cityId) => {
            const cityCases = data.data[cityId];
            const cityName = getCityGuNameWithIds(cityId);
            if (cityCases < 1) return <></>;
            return (
              <Info key={cityId}>
                <CityName>{cityName}</CityName>
                <CityCases>+{cityCases}</CityCases>
              </Info>
            );
          })}
        </Column>
        <Space h={6} />
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
});

const Title = styled("div", {
  subtitle2: true,

  marginTop: rem(14),
  flexShrink: 0,
});

const BellIconContainer = styled("div", {
  rowCentered: true,
  width: rem(40),
  height: rem(40),
  borderRadius: rem(20),
  background: "$gray100",
});

const Info = styled("div", {
  rowCenteredY: true,
  body3: true,

  marginBottom: rem(2),
});

const CityName = styled("div", {});

const CityCases = styled("div", {
  marginLeft: rem(6),
});

export default NotificationModal;
