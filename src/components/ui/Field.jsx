import { T } from "../../theme/tokens.js";

export const Field = (props) => (
  <input {...props}
    className="w-full px-3 py-2 rounded-md text-sm outline-none focus:ring-2"
    style={{
      background: T.surface, border: `1px solid ${T.line}`, color: T.ink,
      fontFamily: props.mono ? T.mono : T.sans, ...(props.style || {}),
    }} />
);
