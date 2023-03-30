import { Helmet } from "react-helmet";

export default function DynamicTitle({ title }) {
  return (
    <Helmet>
      <title>Internet Store | {title}</title>
    </Helmet>
  );
}
