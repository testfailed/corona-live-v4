/**
 
  parseResponsiveCss({
    width: "2px",
    height: { _: "2px", md: "4px" }
  })

  =>

  {
    width: "2px",
    height: "2px",
    
    "@md": {
      hegiht: "4px",
    }
  }

*/

export const parseResponsiveCss = (rawCss: Record<string, any>) => {
  let css: Record<string, any> = {};
  Object.keys(rawCss).forEach((styleProperty) => {
    if (typeof rawCss[styleProperty] === "object") {
      Object.keys(rawCss[styleProperty]).forEach((mediaProperty) => {
        if (mediaProperty === "_") {
          css[styleProperty] = rawCss[styleProperty]["_"];
        } else {
          css[`@${mediaProperty}`] = {
            ...(css[`@${mediaProperty}`] ?? {}),
            [styleProperty]: rawCss[styleProperty][mediaProperty],
          };
        }
      });
    } else {
      css[styleProperty] = rawCss[styleProperty];
    }
  });

  return css;
};
