import { RotatingLines } from "react-loader-spinner";

export default function Spinner() {
  return (
    <div className="spinner">
      <RotatingLines
        style={{ border: "1px solid green" }}
        strokeColor="#2563EB"
        strokeWidth="5"
        animationDuration="1"
        width="120"
        visible={true}
      />
    </div>
  );
}
