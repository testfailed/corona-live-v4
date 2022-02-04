import React, { useEffect, useState } from "react";

import { rem } from "polished";

import { css, styled } from "@styles/stitches.config";

import { Modal } from "@components/Modal";
import { useLocalStorage } from "@hooks/useLocalStorage";

const SamsungDarkModeAlertModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const [isSamsungFirstVisit, setIsSamsungFirstVisit] = useLocalStorage(
    "is-samsung-first-visit",
    true
  );

  useEffect(() => {
    if (
      navigator.userAgent.match(/SamsungBrowser/i) &&
      window.matchMedia("(prefers-color-scheme: dark)") &&
      isSamsungFirstVisit === true
    ) {
      setOpenModal(true);
    }
  }, [isSamsungFirstVisit]);

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      className={css({
        width: "90%",
        padding: rem(16),

        "@md": {
          width: rem(360),
          maxHeight: "80%",
        },
      })}
      onConfrim={(close) => {
        setOpenModal(false);
        setIsSamsungFirstVisit(false);
        close();
      }}
      confirmText="닫기"
    >
      <Wrapper>
        <Title>안내</Title>
        <Info>
          핸드폰에 다크모드가 적용된 상태에서 삼성 인터넷 브라우저를 사용하실시
          코로나 라이브 화면이 이상하게 보일수 있다는점 알려드립니다. 원활한
          이용을 위해서는 다른 브라우저 이용부탁드립니다
        </Info>
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

const Info = styled("div", {
  rowCenteredY: true,
  body3: true,

  marginBottom: rem(2),
});

export default SamsungDarkModeAlertModal;
