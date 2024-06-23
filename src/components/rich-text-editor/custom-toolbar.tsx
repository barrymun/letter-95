/* eslint-disable jsx-a11y/control-has-associated-label */
import "./custom-toolbar.scss";

import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Brush,
  Centre,
  Drvspace7,
  Font,
  Font2,
  Inetcpl1318,
  Italic,
  Justify,
  Left,
  ParaBul,
  ParaNum,
  Progman24,
  Right,
  Underlne,
  WebLink,
} from "@react95/icons";
import Quill from "quill/core";
import { ForwardedRef, forwardRef } from "react";
import { renderToString } from "react-dom/server";

import { Emoji } from "components/svgs";
import { useTheme } from "hooks";
import { SvgProps } from "utils";

const buttonProps: SvgProps = {
  width: 18,
  height: 18,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons = Quill.import("ui/icons") as Record<string, any>;
icons.header["1"] = renderToString(<Font {...buttonProps} />);
icons.header["2"] = renderToString(<Font2 {...buttonProps} />);
icons.bold = renderToString(<Bold {...buttonProps} />);
icons.italic = renderToString(<Italic {...buttonProps} />);
icons.underline = renderToString(<Underlne {...buttonProps} />);
// icons.strike = renderToString(<Strike {...buttonProps} />); // does not exist
icons.indent["-1"] = renderToString(<ArrowLeft {...buttonProps} />);
icons.indent["+1"] = renderToString(<ArrowRight {...buttonProps} />);
icons.align[""] = renderToString(<Left {...buttonProps} />);
icons.align.center = renderToString(<Centre {...buttonProps} />);
icons.align.right = renderToString(<Right {...buttonProps} />);
icons.align.justify = renderToString(<Justify {...buttonProps} />);
icons.list.ordered = renderToString(<ParaNum {...buttonProps} />);
icons.list.bullet = renderToString(<ParaBul {...buttonProps} />);
icons.background = renderToString(<Brush {...buttonProps} />);
icons.color = renderToString(<Inetcpl1318 {...buttonProps} />);
icons.image = renderToString(<Progman24 {...buttonProps} />);
icons.link = renderToString(<WebLink {...buttonProps} />);
icons.emoji = renderToString(<Drvspace7 {...buttonProps} />);

interface CustomToolbarProps {}

const CustomToolbar = forwardRef((_props: CustomToolbarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { theme } = useTheme();

  return (
    <div ref={ref} className="custom-toolbar" style={{ backgroundColor: theme.material }}>
      <span className="ql-formats">
        <button type="button" className="ql-header" value="1" />
        <button type="button" className="ql-header" value="2" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-bold" />
        <button type="button" className="ql-italic" />
        <button type="button" className="ql-underline" />
        <button type="button" className="ql-strike" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-indent" value="+1" />
        <button type="button" className="ql-indent" value="-1" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-align" value="" />
        <button type="button" className="ql-align" value="center" />
        <button type="button" className="ql-align" value="right" />
        <button type="button" className="ql-align" value="justify" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-list" value="ordered" />
        <button type="button" className="ql-list" value="bullet" />
      </span>
      <span className="ql-formats">
        <select className="ql-background" />
        <select className="ql-color" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-link" />
        <button type="button" className="ql-image" />
        {/* <button type="button" className="ql-video" /> */}
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-emoji">
          <Emoji />
        </button>
      </span>
    </div>
  );
});

export default CustomToolbar;
