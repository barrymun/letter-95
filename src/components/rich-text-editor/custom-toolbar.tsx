/* eslint-disable jsx-a11y/control-has-associated-label */
import { ForwardedRef, forwardRef } from "react";

interface CustomToolbarProps {}

const CustomToolbar = forwardRef((_props: CustomToolbarProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref}>
      <button type="button" className="ql-bold" />
      <button type="button" className="ql-italic" />
    </div>
  );
});

export { CustomToolbar };
