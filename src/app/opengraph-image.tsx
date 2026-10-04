import { ImageResponse } from "next/og";
import { site } from "@/content";

export const alt = `${site.name}: ${site.intro}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The OG renderer needs a TTF/OTF; Google Fonts serves TTF to clients that don't ask for woff2.
async function mono(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null; // render with the default font rather than fail
  }
}

export default async function Image() {
  const [regular, bold] = await Promise.all([mono(400), mono(800)]);
  const fonts = [
    ...(regular ? [{ name: "JetBrains Mono", data: regular, weight: 400 as const }] : []),
    ...(bold ? [{ name: "JetBrains Mono", data: bold, weight: 800 as const }] : []),
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#16161e", padding: 56, fontFamily: "JetBrains Mono" }}>
        <div
          style={{
            flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between",
            border: "4px solid #7aa2f7", borderRadius: 20, background: "#1a1b26", padding: 56, color: "#c0caf5",
          }}
        >
          <div style={{ display: "flex", fontSize: 34 }}>
            <span style={{ color: "#9ece6a" }}>{site.prompt}</span>
            <span style={{ color: "#7aa2f7" }}>:~$</span>
            <span style={{ marginLeft: 16 }}>whoami</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 800, color: "#c0caf5" }}>{site.name}</div>
            <div style={{ fontSize: 34, color: "#9aa5ce", marginTop: 12 }}>Linux apps · products · coding videos</div>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#7aa2f7" }}>tonibuilds.codaproduct.studio</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
