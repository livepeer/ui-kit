import { LoadingIcon } from "@livepeer/react/assets";

export default function Loading() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        backgroundColor: "black",
        backdropFilter: "blur(10px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <LoadingIcon
          style={{
            width: "32px",
            height: "32px",
            animation: "spin infinite 1s linear",
          }}
        />
      </div>
    </div>
  );
}
