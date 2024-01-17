import BroadcastPage from "./BroadcastPage";

export default async function Page({ params }: { params: { key?: string } }) {
  return params?.key ? (
    <BroadcastPage streamKey={params.key} objectFit={"contain"} />
  ) : (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <span>
        No stream key found. Please check that the URL contains a stream key and
        try again.
      </span>
    </div>
  );
}
