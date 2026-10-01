import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      // Gracefully return if webhook URL is not configured yet
      return NextResponse.json({ ok: true, note: "Webhook not configured" });
    }

    const body = await req.json().catch(() => ({}));
    const { path = "/", referrer = "Direct Visit", screen = "Unknown" } = body;

    // Extract Vercel Geolocation & Headers
    const country = req.headers.get("x-vercel-ip-country") || "Local / Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
    const region = req.headers.get("x-vercel-ip-country-region") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Unknown UA";

    // Format location string
    const locationString = city !== "Unknown City" 
      ? `${decodeURIComponent(city)}, ${region ? decodeURIComponent(region) + ", " : ""}${country}` 
      : country;

    // Detect high-level device/browser
    let deviceType = "Desktop / Laptop";
    if (/mobile/i.test(userAgent)) deviceType = "Mobile Device";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "Tablet";

    let browserName = "Browser";
    if (/chrome|crios/i.test(userAgent) && !/edge|edg|opr/i.test(userAgent)) browserName = "Google Chrome";
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browserName = "Apple Safari";
    else if (/firefox|fxios/i.test(userAgent)) browserName = "Mozilla Firefox";
    else if (/edg/i.test(userAgent)) browserName = "Microsoft Edge";

    let osName = "Unknown OS";
    if (/macintosh|mac os x/i.test(userAgent)) osName = "macOS";
    else if (/windows nt/i.test(userAgent)) osName = "Windows";
    else if (/android/i.test(userAgent)) osName = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) osName = "iOS";
    else if (/linux/i.test(userAgent)) osName = "Linux";

    // Format Philippine Time (GMT+8)
    const timeString = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Cyberpunk styled Discord Embed
    const discordPayload = {
      username: "JL Portfolio Telemetry",
      avatar_url: "https://raw.githubusercontent.com/yloqqww/jaylo-portfolio/main/public/beymax.jpeg",
      embeds: [
        {
          title: "🚨 New Portfolio Visitor Detected",
          description: `A visitor has landed on your interactive portfolio!`,
          color: 0x4df2ff, // Neon Cyan
          fields: [
            {
              name: "📍 Location",
              value: `\`${locationString}\``,
              inline: true,
            },
            {
              name: "🌐 Source / Referrer",
              value: `\`${referrer.replace(/^https?:\/\//, "").slice(0, 50) || "Direct / Link in Bio"}\``,
              inline: true,
            },
            {
              name: "📄 Landing Page",
              value: `\`${path}\``,
              inline: true,
            },
            {
              name: "💻 Device & OS",
              value: `${deviceType} • ${osName} (${browserName})`,
              inline: true,
            },
            {
              name: "🖥️ Resolution",
              value: `\`${screen}\``,
              inline: true,
            },
            {
              name: "⏰ Time (PH)",
              value: `\`${timeString} GMT+8\``,
              inline: true,
            },
          ],
          footer: {
            text: "Jaylo Ludovice • Digital Core System",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send payload to Discord Webhook asynchronously
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to deliver visitor telemetry:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
