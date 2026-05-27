import { NextResponse } from "next/server";

const SHARE_URL = process.env.NEXT_PUBLIC_SHARE_URL || "";

const WEBSITE_ID = process.env.NEXT_PUBLIC_WEBSITE_ID || "";

export async function GET() {
    try {
        const tokenRes = await fetch(SHARE_URL, {
            cache: "no-store",
        });

        const tokenData = await tokenRes.json();

        const token =
            tokenData.shareToken ||
            tokenData.token ||
            tokenData;

        //   console.log("Token fetched successfully:", token);

        const startAt = 1767205800000;

        const endAt = Date.now();

        const statsRes = await fetch(
            `${process.env.NEXT_PUBLIC_ANALYTICS_URL}/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
            {
                headers: {
                    "x-umami-share-token": token,
                    "x-umami-share-context": "1",
                },
            }
        );

        const stats = await statsRes.json();

        return NextResponse.json({
            "Unique Visitors": stats.visitors > stats.visits ? stats.visitors : stats.visits,
            "Total Views": stats.pageviews,
            "Bounce Rate": stats.bounces,
            "Visit Duration": Math.round(stats.totaltime * 40 / 1000) + "s",
            "Average Visit Duration": Math.round(stats.totaltime / stats.visitors * 40 / 1000) + "s",
            "Time Range": `${new Date(startAt).toLocaleDateString()} - ${new Date(endAt).toLocaleDateString()}, 1 year`,
        });
    } catch (e) {
        return NextResponse.json(
            {
                error: "failed",
            },
            {
                status: 500,
            }
        );
    }
}