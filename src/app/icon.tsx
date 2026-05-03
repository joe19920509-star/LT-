import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** 动态站点图标，消除 /icon 与重写后的 favicon 404 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f7f5f0",
          fontWeight: 700,
        }}
      >
        LT
      </div>
    ),
    { ...size },
  );
}
