import React, { useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import { dayjs } from "@utils/date-util";
import { css, styled } from "@styles/stitches.config";
import { useObjectState } from "@hooks/useObjectState";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { CITY_GU_NAME_LIST, EMAIL } from "@constants/constants";

import { Modal } from "@components/Modal";
import LoadingText from "@components/LoadingText";
import DropdownInput from "@components/DropdownInput";

interface Form {
  message: string;
  email: string;
  src: string;
  cases: string;
  website: string;
  title: string;
}

const initialState = {
  message: "",
  email: "",
  src: "",
  cases: "",
  website: "",
  title: "",
};

export const REPORT_API = `https://64t2pyuhje.execute-api.ap-northeast-2.amazonaws.com/corona-live-email`;
export const URL_REGEX =
  /(https?:\/\/(www\.)?)?[a-z][-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?.\w+/gi;

interface Props {
  reportType?: "report" | "error";
  reportTitle?: string;
}

const ReportModalTrigger: React.FC<Props> = ({
  reportType = "report",
  reportTitle,
  children,
}) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [{ email, title, cases, website }, setForm] = useObjectState<Form>({
    ...initialState,
    title:
      reportType === "error" && reportTitle !== undefined ? reportTitle : "",
  });

  const [submittedReportAt, setSubmittedReportAt] = useLocalStorage<number>(
    "submitted-report-at",
    0
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ [name]: value });
  };

  const setTitleValue = (value: string) => {
    setForm({ title: value });
  };

  const onSumbit = async (closeModal) => {
    const now = dayjs();

    if (now.diff(dayjs(submittedReportAt), "minute") < 3)
      return alert("제보는 3분 내에 한 번만 하실 수 있습니다");

    if (reportType === "report") {
      if (title.trim().length == 0) return alert("지역을 적어주세요");
      if (!CITY_GU_NAME_LIST.includes(title.trim()))
        return alert("유효한 지역을 적어주세요");
      if (website.trim().length > 0 && !website.match(URL_REGEX))
        return alert("링크란에는 링크만 적어주세요 (선택)");
    }

    if (cases.trim().length == 0) return alert("확진자수를 적어주세요");
    if (cases.match(/[^\d]/g)) return alert("확진자수 숫자만 적어주세요");

    setIsLoading(true);

    await fetch(REPORT_API, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, content: `${cases}명 ${website}`, title }),
    });

    setIsLoading(false);
    setForm(initialState);
    setSubmittedReportAt(now.valueOf());
    closeModal();
  };

  return (
    <Modal
      modalId="report"
      triggerNode={children}
      title={t("report_form.title")}
      confirmText={
        <LoadingText isLoading={isLoading} text={t("report_form.button")} />
      }
      onConfrim={onSumbit}
      className={css({
        width: "85%",
        padding: rem(16),
        background: "$white",

        "@md": {
          width: rem(360),
          maxHeight: "80%",
        },
      })}
    >
      <Wrapper>
        <InputWrapper>
          <DropdownInput list={CITY_GU_NAME_LIST} onChange={setTitleValue}>
            <Input
              name="title"
              onChange={onChange}
              value={title}
              placeholder={t("report_form.input.region")}
            />
          </DropdownInput>
          <Input
            placeholder={t("report_form.input.source_url")}
            value={website}
            onChange={onChange}
            name="website"
          />
          <Input
            placeholder={t("report_form.input.confirmed_cases")}
            value={cases}
            onChange={onChange}
            name="cases"
          />
        </InputWrapper>

        <Info>
          <div>{t("report_form.footer")}</div>
          <a href={`mailto: ${EMAIL}`}>{EMAIL}</a>
        </Info>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled("div", {
  column: true,
  paddingTop: rem(8),

  "& a": {
    color: "$gray900",
  },
});

const InputWrapper = styled("div", {
  column: true,
  overflow: "hidden",
  borderRadius: rem(8),
  background: "$white",

  border: `${rem(1)} solid $sectionBorder`,

  boxShadow: "$elevation1",
});

const Input = styled("input", {
  body1: true,
  height: rem(46),
  border: "none",
  borderBottom: `${rem(1)} solid $sectionBorder`,
  background: "transparent",
  boxShadow: "none",
  paddingLeft: rem(12),
  "-webkit-border-radius": 0,
  "-webkit-appearance": "none",

  "&:focus": {
    outline: "none",
  },
  "&::placeholder": {
    color: "$gray500",
  },
  "&:last-child": {
    borderBottom: "none",
  },

  "@md": {
    height: rem(48),
    body1: true,
  },
});

const Info = styled("div", {
  marginTop: rem(20),
  marginBottom: rem(26),
  color: "gray900",
  textAlign: "center",
  body3: true,
});

export default ReportModalTrigger;
