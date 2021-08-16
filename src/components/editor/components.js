import React, { Ref } from "react";
import ReactDOM from "react-dom";
import { cx, css } from "@emotion/css";

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      className={`cursor-pointer px-2 py-1 ${
        active ? 'text-gray-900' : 'text-gray-400'
      }`}
      {...props}
      ref={ref}
      //   className={cx(
      //     className,
      //     css`
      //       cursor: pointer;
      //       color: ${reversed
      //         ? active
      //           ? 'white'
      //           : '#aaa'
      //         : active
      //         ? 'black'
      //         : '#ccc'};
      //     `
      //   )}
    />
  )
);

export const EditorValue = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const textLines = value.document.nodes
      .map((node) => node.text)
      .toArray()
      .join("\n");
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    );
  }
);

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      "material-icons",
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));

export const IconBold = (props) => (
  <span className="font-base text-2xl">B</span>
);

export const IconItalic = (props) => (
  <span className="font-base text-2xl italic">I</span>
);

export const IconUnderline = (props) => (
  <span className="font-base text-2xl underline">U</span>
);

export const IconCode = (props) => (
  <span className="font-mono font-bold text-lg">&lt;&gt;</span>
);

export const IconH1 = (props) => (
    <span className="font-base text-2xl w-2">H1</span>
  );

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }

        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));

export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
  />
));
