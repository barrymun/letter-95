/* eslint-disable jsx-a11y/control-has-associated-label */
import "./custom-toolbar.scss";

import { ForwardedRef, forwardRef } from "react";

interface CustomToolbarProps {}

const CustomToolbar = forwardRef((_props: CustomToolbarProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className="custom-toolbar">
      <button type="button" className="ql-bold" />
      <button type="button" className="ql-italic" />
      <button type="button" className="ql-underline" />
    </div>
  );
});

export { CustomToolbar };
