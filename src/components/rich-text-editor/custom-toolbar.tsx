/* eslint-disable jsx-a11y/control-has-associated-label */
import "./custom-toolbar.scss";

import { ForwardedRef, forwardRef } from "react";

import { Emoji } from "components/svgs";

interface CustomToolbarProps {}

const CustomToolbar = forwardRef((_props: CustomToolbarProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className="custom-toolbar">
      <span className="ql-formats">
        <button type="button" className="ql-header" value="1" />
        <button type="button" className="ql-header" value="2" />
        {/* the following require custom icons */}
        {/* <button type="button" className="ql-header" value="3" /> */}
        {/* <button type="button" className="ql-header" value="4" /> */}
        {/* <button type="button" className="ql-header" value="5" /> */}
        {/* <button type="button" className="ql-header" value="6" /> */}
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
      {/* TODO: */}
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
